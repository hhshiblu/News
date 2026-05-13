#!/usr/bin/env bash
# Build & push app images from Mac (or any host) for Linux VPS pull by IP.
# Default platform: linux/amd64 (typical cloud VPS). Override: DOCKER_PLATFORM=linux/arm64 ./push-images.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck source=/dev/null
  source ./.env
  set +a
fi

PLATFORM="${DOCKER_PLATFORM:-linux/amd64}"
BACKEND_IMAGE="${BACKEND_IMAGE:-hasan55/newsportal_backend:v1}"
FRONTEND_IMAGE="${FRONTEND_IMAGE:-hasan55/newsportal_frontend:v1}"

NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:5000/api/v1}"
NEXT_PUBLIC_FRONTEND_URL="${NEXT_PUBLIC_FRONTEND_URL:-http://localhost:3000}"
BACKEND_INTERNAL_URL="${BACKEND_INTERNAL_URL:-http://backend:5000}"

echo "==> Platform: ${PLATFORM}"
echo "==> Backend:  ${BACKEND_IMAGE}"
echo "==> Frontend: ${FRONTEND_IMAGE}"
echo "==> (Set NEXT_PUBLIC_* in .env before push if your Linux server uses http://IP:port)"
echo ""

if ! docker buildx version >/dev/null 2>&1; then
  echo "docker buildx is required." >&2
  exit 1
fi

echo "==> Building & pushing backend..."
docker buildx build \
  --platform "${PLATFORM}" \
  --push \
  -f "${ROOT}/backend/Dockerfile" \
  -t "${BACKEND_IMAGE}" \
  "${ROOT}/backend"

echo "==> Building & pushing frontend..."
docker buildx build \
  --platform "${PLATFORM}" \
  --push \
  --build-arg "NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}" \
  --build-arg "NEXT_PUBLIC_FRONTEND_URL=${NEXT_PUBLIC_FRONTEND_URL}" \
  --build-arg "BACKEND_INTERNAL_URL=${BACKEND_INTERNAL_URL}" \
  -f "${ROOT}/client/Dockerfile" \
  -t "${FRONTEND_IMAGE}" \
  "${ROOT}/client"

echo ""
echo "Done. On Linux: docker compose pull && docker compose up -d"
