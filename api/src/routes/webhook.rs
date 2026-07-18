use crate::{
    db,
    error::{AppError, AppResult},
    routes::AppState,
};
use axum::{body::Bytes, extract::State, http::HeaderMap, Json};
use chrono::{DateTime, Utc};
use hmac::{Hmac, Mac};
use serde_json::Value;
use sha2::Sha256;
use std::sync::Arc;

type HmacSha256 = Hmac<Sha256>;

pub async fn lemonsqueezy(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    body: Bytes,
) -> AppResult<Json<Value>> {
    let pool = state.pool()?;

    if let Some(secret) = state.config.lemonsqueezy_webhook_secret.as_ref() {
        let signature = headers
            .get("x-signature")
            .and_then(|v| v.to_str().ok())
            .unwrap_or("");
        let mut mac =
            HmacSha256::new_from_slice(secret.as_bytes()).map_err(|e| AppError::Other(e.into()))?;
        mac.update(&body);
        let expected = hex::encode(mac.finalize().into_bytes());
        if signature != expected {
            return Err(AppError::Unauthorized("Invalid webhook signature".into()));
        }
    }

    let payload: Value = serde_json::from_slice(&body)
        .map_err(|e| AppError::BadRequest(format!("Invalid JSON: {e}")))?;

    let event = payload
        .pointer("/meta/event_name")
        .and_then(|v| v.as_str())
        .unwrap_or("unknown");

    tracing::info!("lemonsqueezy webhook: {event}");

    // license_key events / order events may include license keys in different shapes
    if let Some(attrs) = payload.pointer("/data/attributes") {
        if let Some(key) = attrs.get("key").and_then(|v| v.as_str()) {
            let status = attrs
                .get("status")
                .and_then(|v| v.as_str())
                .unwrap_or("inactive");
            let email = payload
                .pointer("/data/attributes/user_email")
                .and_then(|v| v.as_str())
                .or_else(|| {
                    payload
                        .pointer("/meta/custom_data/email")
                        .and_then(|v| v.as_str())
                });
            let expires = attrs
                .get("expires_at")
                .and_then(|v| v.as_str())
                .and_then(|s| DateTime::parse_from_rfc3339(s).ok())
                .map(|d| d.with_timezone(&Utc));
            let limit = attrs
                .get("activation_limit")
                .and_then(|v| v.as_i64())
                .unwrap_or(5) as i32;
            let usage = attrs
                .get("activation_usage")
                .and_then(|v| v.as_i64())
                .unwrap_or(0) as i32;

            db::upsert_license(
                pool,
                key,
                status,
                email,
                expires,
                limit,
                usage,
                payload.pointer("/data/id").and_then(|v| {
                    v.as_str()
                        .and_then(|s| s.parse().ok())
                        .or_else(|| v.as_i64())
                }),
                None,
                None,
            )
            .await?;
        }
    }

    Ok(Json(serde_json::json!({ "ok": true })))
}
