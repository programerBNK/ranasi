use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct LemonLicensePayload {
    pub activated: Option<bool>,
    pub valid: Option<bool>,
    pub deactivated: Option<bool>,
    pub error: Option<String>,
    pub license_key: Option<LemonKey>,
    pub instance: Option<LemonInstance>,
    pub meta: Option<LemonMeta>,
}

#[derive(Debug, Deserialize)]
pub struct LemonKey {
    pub id: Option<i64>,
    pub status: Option<String>,
    pub key: Option<String>,
    pub activation_limit: Option<i32>,
    pub activation_usage: Option<i32>,
    pub expires_at: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct LemonInstance {
    pub id: Option<String>,
    pub name: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct LemonMeta {
    pub customer_email: Option<String>,
    pub order_id: Option<i64>,
    pub customer_id: Option<i64>,
}

async fn ls_post(
    client: &reqwest::Client,
    path: &str,
    fields: &[(&str, &str)],
) -> anyhow::Result<LemonLicensePayload> {
    let res = client
        .post(format!("https://api.lemonsqueezy.com/v1/licenses/{path}"))
        .header("Accept", "application/json")
        .form(fields)
        .send()
        .await?;

    let payload = res.json::<LemonLicensePayload>().await?;
    Ok(payload)
}

pub async fn activate(
    client: &reqwest::Client,
    license_key: &str,
    instance_name: &str,
) -> anyhow::Result<LemonLicensePayload> {
    ls_post(
        client,
        "activate",
        &[
            ("license_key", license_key),
            ("instance_name", instance_name),
        ],
    )
    .await
}

pub async fn validate(
    client: &reqwest::Client,
    license_key: &str,
    instance_id: Option<&str>,
) -> anyhow::Result<LemonLicensePayload> {
    let mut fields = vec![("license_key", license_key)];
    if let Some(id) = instance_id {
        fields.push(("instance_id", id));
    }
    ls_post(client, "validate", &fields).await
}

pub async fn deactivate(
    client: &reqwest::Client,
    license_key: &str,
    instance_id: &str,
) -> anyhow::Result<LemonLicensePayload> {
    ls_post(
        client,
        "deactivate",
        &[
            ("license_key", license_key),
            ("instance_id", instance_id),
        ],
    )
    .await
}
