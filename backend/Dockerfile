# Multi-stage Dockerfile for FastAPI dev
FROM python:3.11-slim AS base

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl bash git && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy and install Python deps
COPY pyproject.toml ./
RUN pip install --upgrade pip && pip install -e .

# Copy source
COPY app ./app
COPY alembic.ini ./
COPY alembic ./alembic

# Default envs (overridden by compose)
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Entrypoint is provided by docker-compose command
