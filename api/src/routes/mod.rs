pub mod fill;
pub mod health;
pub mod license;
pub mod webhook;

use crate::{
    config::Config,
    error::{AppError, AppResult},
};
use axum::{
    routing::{get, post},
    Router,
};
use reqwest::Client;
use sqlx::PgPool;
use std::sync::Arc;
use tokio::sync::OnceCell;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

#[derive(Clone)]
pub struct AppState {
    pub pool: Arc<OnceCell<PgPool>>,
    pub config: Config,
    pub http: Client,
}

impl AppState {
    pub fn pool(&self) -> AppResult<&PgPool> {
        self.pool
            .get()
            .ok_or_else(|| AppError::ServiceUnavailable("Database is starting".into()))
    }
}

pub fn router(state: AppState) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    Router::new()
        .route("/health", get(health::health))
        .route("/v1/license/activate", post(license::activate))
        .route("/v1/license/validate", post(license::validate))
        .route("/v1/license/deactivate", post(license::deactivate))
        .route("/v1/fill", post(fill::fill))
        .route("/v1/webhooks/lemonsqueezy", post(webhook::lemonsqueezy))
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(Arc::new(state))
}
