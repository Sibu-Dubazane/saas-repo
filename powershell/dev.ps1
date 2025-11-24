# dev.ps1
# Starts (or restarts) the dev stack and tails logs

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Repo = Resolve-Path (Join-Path $Root "..")
$DockerDir = Join-Path $Repo "docker"

Push-Location $DockerDir
docker compose -f docker-compose.dev.yml up -d
docker compose -f docker-compose.dev.yml ps
Write-Host "`nTailing logs (Ctrl+C to stop)..."
docker compose -f docker-compose.dev.yml logs -f
Pop-Location
