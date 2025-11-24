param(
  [string]$Message,
  [switch]$Upgrade
)

# Helper to run Alembic commands inside backend container
$DockerCompose = "docker\docker-compose.dev.yml"

if ($Message) {
  Write-Host "Generating migration: $Message"
  docker compose -f $DockerCompose exec backend bash -lc "alembic revision --autogenerate -m `"$Message`""
}

if ($Upgrade) {
  Write-Host "Upgrading database..."
  docker compose -f $DockerCompose exec backend bash -lc "alembic upgrade head"
}
