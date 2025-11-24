# Runs backend pytest inside the container (frontend tests can be added similarly)
$DockerCompose = "docker\docker-compose.dev.yml"
docker compose -f $DockerCompose exec backend bash -lc "pytest -q"
