use crate::models::FormField;
use anyhow::{Context, bail};
use serde_json::{Value, json};

pub async fn map_fields(
    client: &reqwest::Client,
    api_key: &str,
    model: &str,
    profile: &Value,
    fields: &[FormField],
) -> anyhow::Result<serde_json::Map<String, Value>> {
    let compact: Vec<Value> = fields
        .iter()
        .map(|f| {
            json!({
                "uid": f.uid,
                "type": f.r#type,
                "name": f.name,
                "id": f.id,
                "label": if !f.label.is_empty() { &f.label } else if !f.aria_label.is_empty() { &f.aria_label } else { &f.placeholder },
                "autocomplete": f.autocomplete,
            })
        })
        .collect();

    let system = r#"You fill web forms from a user profile.
Return ONLY valid JSON object: { "<uid>": "<value>", ... }
Rules:
- Use only values from the profile (or obvious combinations like full name).
- Skip fields you are unsure about.
- Never invent emails, phones, or payment data not in the profile.
- Prefer empty over wrong.
- Do not output card numbers, CVC, or expiry even if present in profile."#;

    let user = format!(
        "PROFILE:\n{}\n\nFIELDS:\n{}",
        serde_json::to_string_pretty(profile)?,
        serde_json::to_string(&compact)?
    );

    let body = json!({
        "model": model,
        "temperature": 0,
        "response_format": { "type": "json_object" },
        "messages": [
            { "role": "system", "content": system },
            { "role": "user", "content": user }
        ]
    });

    let res = client
        .post("https://api.openai.com/v1/chat/completions")
        .bearer_auth(api_key)
        .json(&body)
        .send()
        .await?;

    if !res.status().is_success() {
        let status = res.status();
        let text = res.text().await.unwrap_or_default();
        bail!("OpenAI HTTP {status}: {text}");
    }

    let json: Value = res.json().await?;
    let content = json
        .pointer("/choices/0/message/content")
        .and_then(|v| v.as_str())
        .context("missing OpenAI content")?;

    let parsed: Value = serde_json::from_str(content)?;
    let obj = parsed
        .as_object()
        .context("AI response is not an object")?
        .clone();

    let allowed: std::collections::HashSet<&str> =
        fields.iter().map(|f| f.uid.as_str()).collect();

    let mut out = serde_json::Map::new();
    for (uid, value) in obj {
        if !allowed.contains(uid.as_str()) {
            continue;
        }
        if let Some(s) = value.as_str() {
            if !s.trim().is_empty() {
                out.insert(uid, Value::String(s.to_string()));
            }
        }
    }

    Ok(out)
}
