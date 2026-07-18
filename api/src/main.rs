mod config;
mod db;
mod error;
mod models;
mod routes;
mod services;

use crate::{config::Config, routes::AppState};
use anyhow::Context;
use sqlx::postgres::PgPoolOptions;
use std::net::SocketAddr;
use std::time::Duration;
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let config = Config::from_env()?;

    // Railway injects PORT; always listen on all interfaces in cloud.
    let host = if std::env::var("RAILWAY_ENVIRONMENT").is_ok()
        || std::env::var("RAILWAY_PROJECT_ID").is_ok()
    {
        "0.0.0.0".to_string()
    } else {
        config.host.clone()
    };
    let port = config.port;
    let addr: SocketAddr = format!("{host}:{port}")
        .parse()
        .context("invalid HOST/PORT")?;

    tracing::info!("PORT={port} — connecting to database…");
    log_db_target(&config.database_url);

    let pool = match tokio::time::timeout(
        Duration::from_secs(25),
        PgPoolOptions::new()
            .max_connections(5)
            .acquire_timeout(Duration::from_secs(10))
            .connect(&config.database_url),
    )
    .await
    {
        Ok(Ok(pool)) => pool,
        Ok(Err(err)) => {
            anyhow::bail!(
                "Database connection failed: {err:#}. Check Railway Variable DATABASE_URL (Supabase URI + ?sslmode=require). Prefer the Session pooler URI from Supabase."
            );
        }
        Err(_) => {
            anyhow::bail!(
                "Database connection timed out after 25s. Use Supabase Pooler URI (port 6543) if direct DB (5432) is unreachable from Railway."
            );
        }
    };

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .context("run migrations")?;
    tracing::info!("Migrations OK");

    let http = reqwest::Client::builder()
        .timeout(Duration::from_secs(45))
        .build()?;

    let state = AppState {
        pool,
        config: config.clone(),
        http,
    };

    let app = routes::router(state);

    tracing::info!("Ranasi API listening on http://{addr}");
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .with_context(|| format!("bind {addr}"))?;

    // Respond to Railway healthchecks as soon as we are listening.
    axum::serve(listener, app).await?;
    Ok(())
}

fn log_db_target(url: &str) {
    // Log host only — never password
    if let Some(after_at) = url.split('@').nth(1) {
        let host = after_at.split('/').next().unwrap_or(after_at);
        tracing::info!("DATABASE host={host}");
    } else {
        tracing::warn!("DATABASE_URL present but could not parse host");
    }
}
