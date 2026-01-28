#!/bin/bash

echo "========================================="
echo "Executando testes do Backend (RSpec)"
echo "========================================="
docker compose run --service-ports --rm -e "RAILS_ENV=test" api bin/rails db:create db:migrate
docker compose run --service-ports --rm -e "RAILS_ENV=test" api bundle exec rspec --exclude-pattern "spec/integration/**/*_spec.rb"

BACKEND_EXIT_CODE=$?

echo ""
echo "========================================="
echo "Executando testes do Frontend (Jest)"
echo "========================================="
docker build -t desafio-dev-frontend-test -f frontend/Dockerfile.test frontend
docker run --rm desafio-dev-frontend-test npm test

FRONTEND_EXIT_CODE=$?

echo ""
echo "========================================="
echo "Resumo dos Testes"
echo "========================================="
if [ $BACKEND_EXIT_CODE -eq 0 ]; then
  echo "✅ Backend: PASSOU"
else
  echo "❌ Backend: FALHOU"
fi

if [ $FRONTEND_EXIT_CODE -eq 0 ]; then
  echo "✅ Frontend: PASSOU"
else
  echo "❌ Frontend: FALHOU"
fi

if [ $BACKEND_EXIT_CODE -eq 0 ] && [ $FRONTEND_EXIT_CODE -eq 0 ]; then
  echo ""
  echo "🎉 Todos os testes passaram!"
  exit 0
else
  echo ""
  echo "⚠️  Alguns testes falharam"
  exit 1
fi
