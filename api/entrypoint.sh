#!/bin/sh

set -e

echo "Aguardando o banco de dados estar disponível..."
while ! nc -z db 5432; do
  sleep 1
done
echo "Banco de dados está disponível!"

# Executa migrações apenas se o comando for o servidor Rails
if [ "$1" = "rails" ] && [ "$2" = "server" ]; then
  echo "Executando migrações do banco..."
  bundle exec rails db:prepare
fi

echo "Executando comando: $@"
exec "$@"
