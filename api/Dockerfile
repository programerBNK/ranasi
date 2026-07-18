# Ranasi Axum API — Railway / container deploy
# Use current stable Rust (deps need rustc >= 1.86)
FROM rust:bookworm AS builder

WORKDIR /app
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

COPY Cargo.toml Cargo.lock ./
COPY src ./src
COPY migrations ./migrations

# Print version in Railway logs so we can verify the toolchain
RUN rustc --version && cargo --version
RUN cargo build --release

FROM debian:bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates libssl3 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/target/release/ranasi-api /usr/local/bin/ranasi-api

ENV RUST_LOG=info
ENV HOST=0.0.0.0
EXPOSE 3130

CMD ["ranasi-api"]
