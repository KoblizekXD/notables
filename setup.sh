#!/bin/bash

set -e

echo "Installing dependencies with bun..."
bun install

echo "Setting up the database with Docker Compose..."
docker-compose up -d

echo "Waiting for the database to be ready..."
until docker-compose exec db pg_isready -U postgres; do
  sleep 1
done

while true; do
    read -p "Did you set DATABASE_URL=postgres://postgres:postgres@localhost:5432/notables_dev? (y/n) " answer
    case $answer in
        [Yy]* ) echo "Awesome, running migrate..."; break;;
        [Nn]* ) echo "Please set it first!"; exit;;
        * ) echo "Please answer y or n.";;
    esac
done

echo "Running Drizzle migrations..."
bun drizzle-kit migrate

echo "Setup complete!"