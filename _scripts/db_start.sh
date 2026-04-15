#!/usr/bin/env bash
set -e

# Load env
set -a
source .env.local
set +a

NAME=spent-postgres
DB=spent
USER=spent_app
PASSWORD=$POSTGRES_PASSWORD

if [ -z "$PASSWORD" ]; then
  echo "POSTGRES_PASSWORD not set in .env.local"
  exit 1
fi


echo "Starting Postgres..."

if [ "$(docker ps -aq -f name=$NAME)" ]; then
  echo "Starting existing container..."
  docker start $NAME
else
  echo "Creating new container..."
  docker run -d \
    --name $NAME \
    -e POSTGRES_DB=$DB \
    -e POSTGRES_USER=$USER \
    -e POSTGRES_PASSWORD=$PASSWORD \
    -p 5432:5432 \
    -v ${NAME}-data:/var/lib/postgresql/data \
    postgres:16
fi

echo "Waiting for DB..."
until docker exec $NAME pg_isready -U $USER > /dev/null 2>&1; do
  sleep 0.2
done

echo "Running migrations..."
cd "$ROOT_DIR"
npm run db:migrate


echo "Done."
