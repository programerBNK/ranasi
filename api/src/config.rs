use std::env;

#[derive(Clone, Debug)]
pub struct Config {
    pub database_url: String,
    pub host: String,
    pub port: u16,
    pub allow_dev_license: bool,
    pub openai_api_key: Option<String>,
    pub openai_model: String,
    pub lemonsqueezy_webhook_secret: Option<String>,
    pub fill_daily_limit: i32,
}

impl Config {
    pub fn from_env() -> anyhow::Result<Self> {
        let on_railway = env::var("RAILWAY_ENVIRONMENT").is_ok()
            || env::var("RAILWAY_PROJECT_ID").is_ok();

        let raw_db = env::var("DATABASE_URL").unwrap_or_default();
        if on_railway && raw_db.trim().is_empty() {
            anyhow::bail!(
                "DATABASE_URL is missing. In Railway → Variables, set DATABASE_URL to your Supabase Postgres URI (with ?sslmode=require)."
            );
        }

        let database_url = normalize_database_url(if raw_db.trim().is_empty() {
            "postgres://ranasi:ranasi@127.0.0.1:5433/ranasi".into()
        } else {
            raw_db
        });

        Ok(Self {
            database_url,
            host: env::var("HOST").unwrap_or_else(|_| "0.0.0.0".into()),
            port: env::var("PORT")
                .ok()
                .and_then(|p| p.parse().ok())
                .unwrap_or(3130),
            // Default true for local; set ALLOW_DEV_LICENSE=false on Railway/production
            allow_dev_license: env::var("ALLOW_DEV_LICENSE")
                .map(|v| v == "true" || v == "1")
                .unwrap_or(true),
            openai_api_key: env::var("OPENAI_API_KEY").ok().filter(|s| !s.is_empty()),
            openai_model: env::var("OPENAI_MODEL").unwrap_or_else(|_| "gpt-4o-mini".into()),
            lemonsqueezy_webhook_secret: env::var("LEMONSQUEEZY_WEBHOOK_SECRET")
                .ok()
                .filter(|s| !s.is_empty()),
            fill_daily_limit: env::var("FILL_DAILY_LIMIT")
                .ok()
                .and_then(|v| v.parse().ok())
                .unwrap_or(200),
        })
    }
}

/** Supabase (and most cloud Postgres) require TLS. */
fn normalize_database_url(mut url: String) -> String {
    let needs_ssl = url.contains("supabase.co") || url.contains("supabase.com");
    if needs_ssl && !url.contains("sslmode=") {
        url = if url.contains('?') {
            format!("{url}&sslmode=require")
        } else {
            format!("{url}?sslmode=require")
        };
    }
    // Help drivers fail faster instead of hanging Railway healthchecks
    if !url.contains("connect_timeout=") {
        url = if url.contains('?') {
            format!("{url}&connect_timeout=15")
        } else {
            format!("{url}?connect_timeout=15")
        };
    }
    url
}
