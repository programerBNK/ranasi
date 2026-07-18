use crate::models::License;
use chrono::{DateTime, Utc};
use sqlx::PgPool;
use uuid::Uuid;

pub async fn upsert_license(
    pool: &PgPool,
    key: &str,
    status: &str,
    email: Option<&str>,
    expires_at: Option<DateTime<Utc>>,
    activation_limit: i32,
    activation_usage: i32,
    ls_license_id: Option<i64>,
    ls_order_id: Option<i64>,
    ls_customer_id: Option<i64>,
) -> sqlx::Result<License> {
    sqlx::query_as::<_, License>(
        r#"
        INSERT INTO licenses (
            key, status, email, expires_at, activation_limit, activation_usage,
            ls_license_id, ls_order_id, ls_customer_id, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW())
        ON CONFLICT (key) DO UPDATE SET
            status = EXCLUDED.status,
            email = COALESCE(EXCLUDED.email, licenses.email),
            expires_at = EXCLUDED.expires_at,
            activation_limit = EXCLUDED.activation_limit,
            activation_usage = EXCLUDED.activation_usage,
            ls_license_id = COALESCE(EXCLUDED.ls_license_id, licenses.ls_license_id),
            ls_order_id = COALESCE(EXCLUDED.ls_order_id, licenses.ls_order_id),
            ls_customer_id = COALESCE(EXCLUDED.ls_customer_id, licenses.ls_customer_id),
            updated_at = NOW()
        RETURNING *
        "#,
    )
    .bind(key)
    .bind(status)
    .bind(email)
    .bind(expires_at)
    .bind(activation_limit)
    .bind(activation_usage)
    .bind(ls_license_id)
    .bind(ls_order_id)
    .bind(ls_customer_id)
    .fetch_one(pool)
    .await
}

pub async fn get_license(pool: &PgPool, key: &str) -> sqlx::Result<Option<License>> {
    sqlx::query_as::<_, License>("SELECT * FROM licenses WHERE key = $1")
        .bind(key)
        .fetch_optional(pool)
        .await
}

pub async fn create_instance(
    pool: &PgPool,
    license_key: &str,
    name: &str,
) -> sqlx::Result<Uuid> {
    let id = Uuid::new_v4();
    sqlx::query(
        r#"
        INSERT INTO license_instances (id, license_key, name)
        VALUES ($1, $2, $3)
        "#,
    )
    .bind(id)
    .bind(license_key)
    .bind(name)
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        UPDATE licenses
        SET activation_usage = activation_usage + 1, status = 'active', updated_at = NOW()
        WHERE key = $1
        "#,
    )
    .bind(license_key)
    .execute(pool)
    .await?;

    Ok(id)
}

pub async fn touch_instance(pool: &PgPool, id: Uuid) -> sqlx::Result<()> {
    sqlx::query("UPDATE license_instances SET last_seen_at = NOW() WHERE id = $1")
        .bind(id)
        .execute(pool)
        .await?;
    Ok(())
}

pub async fn delete_instance(pool: &PgPool, id: Uuid, license_key: &str) -> sqlx::Result<()> {
    let res = sqlx::query("DELETE FROM license_instances WHERE id = $1 AND license_key = $2")
        .bind(id)
        .bind(license_key)
        .execute(pool)
        .await?;

    if res.rows_affected() > 0 {
        sqlx::query(
            r#"
            UPDATE licenses
            SET activation_usage = GREATEST(activation_usage - 1, 0), updated_at = NOW()
            WHERE key = $1
            "#,
        )
        .bind(license_key)
        .execute(pool)
        .await?;
    }
    Ok(())
}

pub async fn bump_fill_usage(pool: &PgPool, license_key: &str, limit: i32) -> sqlx::Result<i32> {
    let row: (i32,) = sqlx::query_as(
        r#"
        INSERT INTO fill_usage (license_key, day, count)
        VALUES ($1, CURRENT_DATE, 1)
        ON CONFLICT (license_key, day) DO UPDATE
        SET count = fill_usage.count + 1
        RETURNING count
        "#,
    )
    .bind(license_key)
    .fetch_one(pool)
    .await?;

    if row.0 > limit {
        // roll back the bump conceptually by leaving it — caller rejects
        return Ok(row.0);
    }
    Ok(row.0)
}

pub fn is_license_active(license: &License) -> bool {
    if matches!(license.status.as_str(), "disabled" | "expired") {
        return false;
    }
    if let Some(exp) = license.expires_at {
        if exp < Utc::now() {
            return false;
        }
    }
    true
}
