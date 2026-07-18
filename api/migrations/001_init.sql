CREATE TABLE IF NOT EXISTS licenses (
    key TEXT PRIMARY KEY,
    status TEXT NOT NULL DEFAULT 'inactive',
    email TEXT,
    expires_at TIMESTAMPTZ,
    activation_limit INT NOT NULL DEFAULT 5,
    activation_usage INT NOT NULL DEFAULT 0,
    ls_license_id BIGINT,
    ls_order_id BIGINT,
    ls_customer_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS license_instances (
    id UUID PRIMARY KEY,
    license_key TEXT NOT NULL REFERENCES licenses(key) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_instances_license ON license_instances(license_key);

CREATE TABLE IF NOT EXISTS fill_usage (
    license_key TEXT NOT NULL REFERENCES licenses(key) ON DELETE CASCADE,
    day DATE NOT NULL,
    count INT NOT NULL DEFAULT 0,
    PRIMARY KEY (license_key, day)
);
