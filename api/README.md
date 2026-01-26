# CNAB API Backend

## 🚀 Tecnologias

- **Ruby on Rails 7.1**
- **PostgreSQL**: Banco de dados relacional
- **Sidekiq**: Processamento assíncrono de jobs
- **Redis**: Cache e message broker
- **RSpec**: Testes unitários e de integração
- **RSwag**: Documentação OpenAPI/Swagger

## 📋 Estrutura

### Models
- `Store`: Lojas com saldo consolidado
- `Transaction`: Transações financeiras CNAB

### Controllers
- `V1::TransactionsController`: Listagem de transações agrupadas por loja
- `V1::UploadsController`: Upload e processamento de arquivos CNAB

### Jobs
- `ProcessCnabJob`: Processa arquivos CNAB assincronamente via Sidekiq

### Libs
- `CnabParser`: Parser de arquivos CNAB com validação

## 🧪 Testes

```bash
# Executar todos os testes
./spec.sh

# Apenas testes do backend
docker compose run --rm -e "RAILS_ENV=test" api bundle exec rspec
```

### Cobertura
- ✅ Models: 100%
- ✅ Controllers: 100%
- ✅ Jobs: 100%
- ✅ Libs: 100%

## 📡 Endpoints

### GET /api/v1/transactions
Retorna todas as transações agrupadas por loja com saldo consolidado.

**Resposta:**
```json
[
  {
    "store_name": "LOJA DO Ó - MATRIZ",
    "balance": "102.00",
    "transactions": [
      {
        "id": 1,
        "transaction_type": 1,
        "date": "2019-03-01",
        "value": "157.00",
        "cpf": "09620676017",
        "card": "4753****3153",
        "time": "15:34:53",
        "store_owner": "JOÃO MACEDO",
        "store_name": "LOJA DO Ó - MATRIZ",
        "description": "Débito",
        "nature": "Entrada",
        "sign": "+"
      }
    ]
  }
]
```

### POST /api/v1/upload
Faz upload de arquivo CNAB para processamento.

**Requisição:**
- Content-Type: `multipart/form-data`
- Campo: `file` (arquivo .txt)

**Resposta (Sucesso):**
```json
{
  "message": "Arquivo enviado para processamento",
  "job_id": "abc123"
}
```

**Resposta (Erro):**
```json
{
  "error": "Nenhum arquivo enviado"
}
```

## 🔧 Configuração

### Variáveis de Ambiente
```bash
RAILS_ENV=development|test|production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

### Migrations
```bash
# Criar banco de dados
rails db:create

# Executar migrations
rails db:migrate

# Seed (opcional)
rails db:seed
```

## 📚 Documentação

Documentação interativa disponível em:
- **Local**: http://localhost/api-docs/index.html
- **Produção**: http://vps56446.publiccloud.com.br/cnab/api-docs/index.html
