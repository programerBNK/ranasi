use crate::{
    db,
    error::{AppError, AppResult},
    models::{ActivateRequest, DeactivateRequest, LicenseResponse, ValidateRequest},
    routes::AppState,
    services::lemon,
};
use axum::{extract::State, Json};
use chrono::{DateTime, Duration, Utc};
use std::sync::Arc;
use uuid::Uuid;

const DEV_KEY: &str = "RN-DEV-PRO";
const LEGACY_DEV_KEY: &str = "AF-DEV-PRO";

fn canonical_dev_key(key: &str) -> Option<&'static str> {
    if key.eq_ignore_ascii_case(DEV_KEY) {
        Some(DEV_KEY)
    } else if key.eq_ignore_ascii_case(LEGACY_DEV_KEY) {
        Some(LEGACY_DEV_KEY)
    } else {
        None
    }
}

pub async fn activate(
    State(state): State<Arc<AppState>>,
    Json(body): Json<ActivateRequest>,
) -> AppResult<Json<LicenseResponse>> {
    let key = body.license_key.trim().to_string();
    if key.is_empty() {
        return Err(AppError::BadRequest("Missing licenseKey".into()));
    }
    let instance_name = body.instance_name.unwrap_or_else(|| "Ranasi".into());

    if let Some(dev_key) = state
        .config
        .allow_dev_license
        .then(|| canonical_dev_key(&key))
        .flatten()
    {
        return Ok(Json(activate_dev(&state, dev_key, &instance_name).await?));
    }

    // Prefer Lemon Squeezy when reachable; also persist locally
    match lemon::activate(&state.http, &key, &instance_name).await {
        Ok(payload) => {
            if payload.activated != Some(true) {
                return Ok(Json(LicenseResponse {
                    valid: false,
                    error: Some(payload.error.unwrap_or_else(|| "Activation failed".into())),
                    instance_id: None,
                    email: None,
                    expires_at: None,
                    status: None,
                }));
            }

            let lk = payload.license_key.as_ref();
            let expires = parse_expires(lk.and_then(|k| k.expires_at.as_deref()));
            let email = payload.meta.as_ref().and_then(|m| m.customer_email.clone());

            db::upsert_license(
                &state.pool,
                &key,
                lk.and_then(|k| k.status.as_deref()).unwrap_or("active"),
                email.as_deref(),
                expires,
                lk.and_then(|k| k.activation_limit).unwrap_or(5),
                lk.and_then(|k| k.activation_usage).unwrap_or(1),
                lk.and_then(|k| k.id),
                payload.meta.as_ref().and_then(|m| m.order_id),
                payload.meta.as_ref().and_then(|m| m.customer_id),
            )
            .await?;

            let instance_id = if let Some(id) = payload.instance.as_ref().and_then(|i| i.id.clone())
            {
                // store LS instance id as uuid if possible, else create our own mapping
                if let Ok(uuid) = Uuid::parse_str(&id) {
                    // ensure row exists
                    let _ = sqlx::query(
                        r#"
                        INSERT INTO license_instances (id, license_key, name)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (id) DO UPDATE SET last_seen_at = NOW()
                        "#,
                    )
                    .bind(uuid)
                    .bind(&key)
                    .bind(&instance_name)
                    .execute(&state.pool)
                    .await;
                    Some(id)
                } else {
                    let local = db::create_instance(&state.pool, &key, &instance_name).await?;
                    Some(local.to_string())
                }
            } else {
                let local = db::create_instance(&state.pool, &key, &instance_name).await?;
                Some(local.to_string())
            };

            Ok(Json(LicenseResponse {
                valid: true,
                error: None,
                instance_id,
                email,
                expires_at: expires,
                status: Some("active".into()),
            }))
        }
        Err(err) => {
            // Fallback: license already in DB (from webhook)
            tracing::warn!("lemon activate failed, trying local: {err:#}");
            activate_local(&state, &key, &instance_name).await
        }
    }
}

pub async fn validate(
    State(state): State<Arc<AppState>>,
    Json(body): Json<ValidateRequest>,
) -> AppResult<Json<LicenseResponse>> {
    let key = body.license_key.trim().to_string();
    if key.is_empty() {
        return Err(AppError::BadRequest("Missing licenseKey".into()));
    }

    if let Some(dev_key) = state
        .config
        .allow_dev_license
        .then(|| canonical_dev_key(&key))
        .flatten()
    {
        let license = ensure_dev_license(&state, dev_key).await?;
        return Ok(Json(LicenseResponse {
            valid: true,
            error: None,
            instance_id: body.instance_id,
            email: license.email,
            expires_at: license.expires_at,
            status: Some(license.status),
        }));
    }

    if let Some(license) = db::get_license(&state.pool, &key).await? {
        if !db::is_license_active(&license) {
            return Ok(Json(LicenseResponse {
                valid: false,
                error: Some("License expired or disabled".into()),
                instance_id: None,
                email: license.email,
                expires_at: license.expires_at,
                status: Some(license.status),
            }));
        }
        if let Some(ref id) = body.instance_id {
            if let Ok(uuid) = Uuid::parse_str(id) {
                let _ = db::touch_instance(&state.pool, uuid).await;
            }
        }
        return Ok(Json(LicenseResponse {
            valid: true,
            error: None,
            instance_id: body.instance_id,
            email: license.email,
            expires_at: license.expires_at,
            status: Some(license.status),
        }));
    }

    // Try Lemon validate then persist
    match lemon::validate(&state.http, &key, body.instance_id.as_deref()).await {
        Ok(payload) if payload.valid == Some(true) => {
            let lk = payload.license_key.as_ref();
            let expires = parse_expires(lk.and_then(|k| k.expires_at.as_deref()));
            let email = payload.meta.as_ref().and_then(|m| m.customer_email.clone());
            db::upsert_license(
                &state.pool,
                &key,
                lk.and_then(|k| k.status.as_deref()).unwrap_or("active"),
                email.as_deref(),
                expires,
                lk.and_then(|k| k.activation_limit).unwrap_or(5),
                lk.and_then(|k| k.activation_usage).unwrap_or(0),
                lk.and_then(|k| k.id),
                payload.meta.as_ref().and_then(|m| m.order_id),
                payload.meta.as_ref().and_then(|m| m.customer_id),
            )
            .await?;

            Ok(Json(LicenseResponse {
                valid: true,
                error: None,
                instance_id: body
                    .instance_id
                    .or_else(|| payload.instance.as_ref().and_then(|i| i.id.clone())),
                email,
                expires_at: expires,
                status: Some("active".into()),
            }))
        }
        Ok(payload) => Ok(Json(LicenseResponse {
            valid: false,
            error: Some(payload.error.unwrap_or_else(|| "License invalid".into())),
            instance_id: None,
            email: None,
            expires_at: None,
            status: None,
        })),
        Err(_) => Ok(Json(LicenseResponse {
            valid: false,
            error: Some("License not found".into()),
            instance_id: None,
            email: None,
            expires_at: None,
            status: None,
        })),
    }
}

pub async fn deactivate(
    State(state): State<Arc<AppState>>,
    Json(body): Json<DeactivateRequest>,
) -> AppResult<Json<LicenseResponse>> {
    let key = body.license_key.trim().to_string();
    let instance_id = body.instance_id.trim().to_string();

    if let Some(dev_key) = state
        .config
        .allow_dev_license
        .then(|| canonical_dev_key(&key))
        .flatten()
    {
        if let Ok(uuid) = Uuid::parse_str(&instance_id) {
            let _ = db::delete_instance(&state.pool, uuid, dev_key).await;
        }
        return Ok(Json(LicenseResponse {
            valid: true,
            error: None,
            instance_id: Some(instance_id),
            email: None,
            expires_at: None,
            status: Some("inactive".into()),
        }));
    }

    let _ = lemon::deactivate(&state.http, &key, &instance_id).await;
    if let Ok(uuid) = Uuid::parse_str(&instance_id) {
        db::delete_instance(&state.pool, uuid, &key).await?;
    }

    Ok(Json(LicenseResponse {
        valid: true,
        error: None,
        instance_id: Some(instance_id),
        email: None,
        expires_at: None,
        status: Some("inactive".into()),
    }))
}

async fn activate_dev(
    state: &AppState,
    key: &str,
    instance_name: &str,
) -> AppResult<LicenseResponse> {
    let license = ensure_dev_license(state, key).await?;
    let id = db::create_instance(&state.pool, key, instance_name).await?;
    Ok(LicenseResponse {
        valid: true,
        error: None,
        instance_id: Some(id.to_string()),
        email: license.email,
        expires_at: license.expires_at,
        status: Some("active".into()),
    })
}

async fn activate_local(
    state: &AppState,
    key: &str,
    instance_name: &str,
) -> AppResult<Json<LicenseResponse>> {
    let Some(license) = db::get_license(&state.pool, key).await? else {
        return Ok(Json(LicenseResponse {
            valid: false,
            error: Some("License not found. Complete checkout first.".into()),
            instance_id: None,
            email: None,
            expires_at: None,
            status: None,
        }));
    };

    if !db::is_license_active(&license) {
        return Ok(Json(LicenseResponse {
            valid: false,
            error: Some("License expired or disabled".into()),
            instance_id: None,
            email: license.email,
            expires_at: license.expires_at,
            status: Some(license.status),
        }));
    }

    if license.activation_usage >= license.activation_limit {
        return Ok(Json(LicenseResponse {
            valid: false,
            error: Some("Activation limit reached".into()),
            instance_id: None,
            email: license.email,
            expires_at: license.expires_at,
            status: Some(license.status),
        }));
    }

    let id = db::create_instance(&state.pool, key, instance_name).await?;
    Ok(Json(LicenseResponse {
        valid: true,
        error: None,
        instance_id: Some(id.to_string()),
        email: license.email,
        expires_at: license.expires_at,
        status: Some("active".into()),
    }))
}

async fn ensure_dev_license(state: &AppState, key: &str) -> AppResult<crate::models::License> {
    let expires = Utc::now() + Duration::days(365);
    Ok(db::upsert_license(
        &state.pool,
        key,
        "active",
        Some("dev@ranasi.local"),
        Some(expires),
        99,
        0,
        None,
        None,
        None,
    )
    .await?)
}

fn parse_expires(raw: Option<&str>) -> Option<chrono::DateTime<Utc>> {
    let raw = raw?;
    DateTime::parse_from_rfc3339(raw)
        .ok()
        .map(|d| d.with_timezone(&Utc))
}
