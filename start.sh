#!/bin/bash

echo "Inicializando projeto CNAB..."

rm -f api/tmp/pids/server.pid

if [ ! -f "frontend/styles/output.css" ]; then
  echo "Gerando CSS do Tailwind..."
  cd frontend && npm install && npm run build:css && cd ..
fi

echo "Iniciando containers Docker..."
docker compose build
docker compose up
