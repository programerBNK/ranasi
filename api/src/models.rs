use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, sqlx::FromRow)]
pub struct License {
    pub key: String,
    pub status: String,
    pub email: Option<String>,
    pub expires_at: Option<DateTime<Utc>>,
    pub activation_limit: i32,
    pub activation_usage: i32,
    pub ls_license_id: Option<i64>,
    pub ls_order_id: Option<i64>,
    pub ls_customer_id: Option<i64>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, sqlx::FromRow)]
pub struct LicenseInstance {
    pub id: Uuid,
    pub license_key: String,
    pub name: String,
    pub created_at: DateTime<Utc>,
    pub last_seen_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct ActivateRequest {
    #[serde(rename = "licenseKey")]
    pub license_key: String,
    #[serde(rename = "instanceName")]
    pub instance_name: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ValidateRequest {
    #[serde(rename = "licenseKey")]
    pub license_key: String,
    #[serde(rename = "instanceId")]
    pub instance_id: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct DeactivateRequest {
    #[serde(rename = "licenseKey")]
    pub license_key: String,
    #[serde(rename = "instanceId")]
    pub instance_id: String,
}

#[derive(Debug, Serialize)]
pub struct LicenseResponse {
    pub valid: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    #[serde(rename = "instanceId", skip_serializing_if = "Option::is_none")]
    pub instance_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,
    #[serde(rename = "expiresAt", skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct FormField {
    pub uid: String,
    #[serde(default)]
    pub tag: String,
    #[serde(default)]
    pub r#type: String,
    #[serde(default)]
    pub name: String,
    #[serde(default)]
    pub id: String,
    #[serde(default)]
    pub autocomplete: String,
    #[serde(default)]
    pub placeholder: String,
    #[serde(default)]
    pub label: String,
    #[serde(rename = "ariaLabel", default)]
    pub aria_label: String,
}

#[derive(Debug, Deserialize)]
pub struct FillRequest {
    #[serde(rename = "licenseKey")]
    pub license_key: String,
    #[serde(rename = "instanceId")]
    pub instance_id: Option<String>,
    pub fields: Vec<FormField>,
    /// Profile fields excluding card data
    pub profile: serde_json::Value,
}

#[derive(Debug, Serialize)]
pub struct FillResponse {
    pub ok: bool,
    pub map: serde_json::Map<String, serde_json::Value>,
    pub mode: String,
    pub filled: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

#[derive(Debug, sqlx::FromRow)]
pub struct FillUsage {
    pub license_key: String,
    pub day: NaiveDate,
    pub count: i32,
}
