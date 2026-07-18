use crate::{
    db,
    error::{AppError, AppResult},
    models::{FillRequest, FillResponse},
    routes::AppState,
    services::openai,
};
use axum::{extract::State, Json};
use serde_json::Value;
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
const BLOCKED_PROFILE_KEYS: &[&str] = &[
    "cardNumber",
    "cardCvc",
    "cardExp",
    "cardName",
    "card_number",
    "card_cvc",
    "cvc",
    "cvv",
];

pub async fn fill(
    State(state): State<Arc<AppState>>,
    Json(body): Json<FillRequest>,
) -> AppResult<Json<FillResponse>> {
    let key = body.license_key.trim().to_string();
    if key.is_empty() {
        return Err(AppError::BadRequest("Missing licenseKey".into()));
    }
    if body.fields.is_empty() {
        return Err(AppError::BadRequest("No fields".into()));
    }
    let pool = state.pool()?;

    let dev_key = state
        .config
        .allow_dev_license
        .then(|| canonical_dev_key(&key))
        .flatten();
    let is_dev = dev_key.is_some();

    let license = if is_dev {
        db::upsert_license(
            pool,
            dev_key.expect("checked above"),
            "active",
            Some("dev@ranasi.local"),
            Some(chrono::Utc::now() + chrono::Duration::days(365)),
            99,
            0,
            None,
            None,
            None,
        )
        .await?
    } else {
        db::get_license(pool, &key)
            .await?
            .ok_or_else(|| AppError::Forbidden("Pro license required".into()))?
    };

    if !db::is_license_active(&license) {
        return Err(AppError::Forbidden("License expired or disabled".into()));
    }

    if let Some(ref id) = body.instance_id {
        if let Ok(uuid) = Uuid::parse_str(id) {
            let _ = db::touch_instance(pool, uuid).await;
        }
    }

    let usage = db::bump_fill_usage(pool, &license.key, state.config.fill_daily_limit).await?;
    if usage > state.config.fill_daily_limit {
        return Err(AppError::TooManyRequests(format!(
            "Daily AI fill limit ({}) reached",
            state.config.fill_daily_limit
        )));
    }

    let Some(api_key) = state.config.openai_api_key.as_ref() else {
        // Dev without OpenAI: return empty map so client falls back to heuristic
        if is_dev {
            return Ok(Json(FillResponse {
                ok: true,
                map: serde_json::Map::new(),
                mode: "server-fallback".into(),
                filled: 0,
                error: Some("OPENAI_API_KEY not set — using client heuristic".into()),
            }));
        }
        return Err(AppError::BadRequest(
            "Server AI not configured (OPENAI_API_KEY)".into(),
        ));
    };

    let profile = sanitize_profile(&body.profile);

    let map = openai::map_fields(
        &state.http,
        api_key,
        &state.config.openai_model,
        &profile,
        &body.fields,
    )
    .await
    .map_err(|e| AppError::Other(e))?;

    let filled = map.len();
    Ok(Json(FillResponse {
        ok: filled > 0,
        map,
        mode: "ai".into(),
        filled,
        error: if filled == 0 {
            Some("AI returned no field matches".into())
        } else {
            None
        },
    }))
}

fn sanitize_profile(profile: &Value) -> Value {
    match profile {
        Value::Object(obj) => {
            let mut clean = serde_json::Map::new();
            for (k, v) in obj {
                if BLOCKED_PROFILE_KEYS
                    .iter()
                    .any(|b| k.eq_ignore_ascii_case(b))
                {
                    continue;
                }
                // also skip empty strings
                if v.as_str().is_some_and(|s| s.trim().is_empty()) {
                    continue;
                }
                clean.insert(k.clone(), v.clone());
            }
            Value::Object(clean)
        }
        other => other.clone(),
    }
}
