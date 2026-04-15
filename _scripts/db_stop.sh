#!/usr/bin/env bash
set -e

NAME=spent-postgres
VOLUME=${NAME}-data

echo "Stopping container (if running)..."
docker stop $NAME 2>/dev/null || true

echo "Removing container..."
docker rm $NAME 2>/dev/null || true

echo "Removing volume (deletes all data)..."
docker volume rm $VOLUME 2>/dev/null || true

echo "Done."
