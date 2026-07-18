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
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let config = Config::from_env()?;
    let pool = PgPoolOptions::new()
        .max_connections(10)
        .connect(&config.database_url)
        .await
        .context("connect postgres")?;

    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .context("run migrations")?;

    let http = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(45))
        .build()?;

    let state = AppState {
        pool,
        config: config.clone(),
        http,
    };

    let app = routes::router(state);
    let addr: SocketAddr = format!("{}:{}", config.host, config.port).parse()?;
    tracing::info!("AutoFlow API listening on http://{addr}");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;
    Ok(())
}
