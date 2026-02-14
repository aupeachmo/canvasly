#!/usr/bin/env bash
set -euo pipefail

BASE_PATH="${1:-/canvasly/}"
OUTPUT_DIR="./docs"

echo "Building with BASE_PATH=${BASE_PATH}..."

# Build the Docker image
docker build \
  --build-arg BASE_PATH="${BASE_PATH}" \
  -t canvasly-build .

# Extract the built files from the image
rm -rf "${OUTPUT_DIR}"
CONTAINER_ID=$(docker create canvasly-build)
docker cp "${CONTAINER_ID}:/usr/share/nginx/html" "${OUTPUT_DIR}"
docker rm "${CONTAINER_ID}" > /dev/null

echo ""
echo "Done! Static files are in ${OUTPUT_DIR}/"
echo "Commit and push — GitHub Pages serves from /docs on master."
