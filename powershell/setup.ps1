<# 
  setup.ps1
  One-time (or first run) bootstrap:
  - Copy env templates
  - Generate a JWT secret
  - Install frontend deps
  - Build images
  - Run compose stack and apply migrations
#>

param(
  [switch]$Force # Use -Force to overwrite existing env files
)

$ErrorActionPreference = "Stop"

Write-Host "==> Bootstrapping local dev environment..."

# Paths
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Repo = Resolve-Path (Join-Path $Root "..")
$DockerDir = Join-Path $Repo "docker"
$BackendDir = Join-Path $Repo "backend"
$FrontendDir = Join-Path $Repo "frontend"

# 1) Copy env templates
function Copy-IfMissing {
  param([string]$Src, [string]$Dst)
  if (Test-Path $Dst) {
    if ($Force) {
      Copy-Item $Src $Dst -Force
      Write-Host "Overwrote $Dst"
    } else {
      Write-Host "Exists: $Dst (use -Force to overwrite)"
    }
  } else {
    Copy-Item $Src $Dst
    Write-Host "Created: $Dst"
  }
}

Copy-IfMissing (Join-Path $DockerDir ".env.example") (Join-Path $DockerDir ".env")
Copy-IfMissing (Join-Path $BackendDir ".env.example") (Join-Path $BackendDir ".env")
Copy-IfMissing (Join-Path $FrontendDir ".env.local.example") (Join-Path $FrontendDir ".env.local")

# 2) Generate a random JWT secret, write to docker/.env and backend/.env if placeholder
function Set-EnvValue {
  param([string]$File, [string]$Key, [string]$Value)
  $content = Get-Content $File
  $updated = $false
  $newContent = $content | ForEach-Object {
    if ($_ -match "^$Key=") { $updated = $true; "$Key=$Value" } else { $_ }
  }
  if (-not $updated) { $newContent += "$Key=$Value" }
  $newContent | Set-Content $File -NoNewline
}

# create random 64-char hex
$Bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($Bytes)
$Jwt = ($Bytes | ForEach-Object { $_.ToString("x2") }) -join ""

Set-EnvValue (Join-Path $DockerDir ".env") "JWT_SECRET" $Jwt
Set-EnvValue (Join-Path $BackendDir ".env") "JWT_SECRET" $Jwt

# 3) Install frontend deps (inside host to leverage pnpm cache if you prefer)
if (-Not (Test-Path (Join-Path $FrontendDir "node_modules"))) {
  Write-Host "Installing frontend dependencies..."
  Push-Location $FrontendDir
  npm install
  Pop-Location
}

# 4) Build dev images (first time build will be longer)
Write-Host "Building Docker images..."
Push-Location $DockerDir
docker compose -f docker-compose.dev.yml build
Pop-Location

# 5) Start stack (this will also run Alembic upgrade in backend service)
Write-Host "Starting services..."
Push-Location $DockerDir
docker compose -f docker-compose.dev.yml up -d
Pop-Location

Write-Host "==> Setup complete."
Write-Host "Frontend: http://localhost:3000"
Write-Host "API: http://localhost:8000"
Write-Host "Traefik: http://localhost:8080"
