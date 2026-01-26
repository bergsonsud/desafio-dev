# CNAB API

API para importação de arquivos CNAB e visualização das transações financeiras.

É um fork do projeto [desafio dev] da ByCoders. Readme original [README-original.md](README-original.md)

Este projeto tem como objetivo **upload e processamento de arquivos CNAB**, normalizando os dados financeiros de lojas e armazenando essas informações em um banco de dados relacional. Além disso, as transações processadas são disponibilizadas para visualização via API.

## 🚀 Tecnologias Utilizadas
![Rails][Rails]![Docker][Docker]![PostgreSQL][PostgreSQL]![Sidekiq][Sidekiq]![Redis][Redis]
### Frontend
- **HTML5**: Estrutura semântica e moderna
- **Tailwind CSS v4**: Framework CSS utility-first para estilização
- **Vanilla JavaScript**: Código modular com padrão de service
- **Jest**: Testes unitários com 100% de cobertura

### Backend
- **Ruby on Rails**: Framework para desenvolvimento do backend da aplicação, facilitando a construção da API e a integração com o banco de dados.
- **Sidekiq**: Processamento de jobs assíncronos para tarefas de longa duração, como o processamento e normalização dos arquivos CNAB.
- **Redis**: Utilizado como broker para o Sidekiq e também para cache de dados temporários, melhorando a performance da aplicação.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar as movimentações financeiras e informações relacionadas, garantindo integridade e flexibilidade no armazenamento dos dados.

## 📄 Documentação do CNAB


| Descrição do campo  | Inicio | Fim | Tamanho | Comentário
| ------------- | ------------- | -----| ---- | ------
| Tipo  | 1  | 1 | 1 | Tipo da transação
| Data  | 2  | 9 | 8 | Data da ocorrência
| Valor | 10 | 19 | 10 | Valor da movimentação. *Obs.* O valor encontrado no arquivo precisa ser divido por cem(valor / 100.00) para normalizá-lo.
| CPF | 20 | 30 | 11 | CPF do beneficiário
| Cartão | 31 | 42 | 12 | Cartão utilizado na transação 
| Hora  | 43 | 48 | 6 | Hora da ocorrência atendendo ao fuso de UTC-3
| Dono da loja | 49 | 62 | 14 | Nome do representante da loja
| Nome loja | 63 | 81 | 19 | Nome da loja

# Documentação sobre os tipos das transações

| Tipo | Descrição | Natureza | Sinal |
| ---- | -------- | --------- | ----- |
| 1 | Débito | Entrada | + |
| 2 | Boleto | Saída | - |
| 3 | Financiamento | Saída | - |
| 4 | Crédito | Entrada | + |
| 5 | Recebimento Empréstimo | Entrada | + |
| 6 | Vendas | Entrada | + |
| 7 | Recebimento TED | Entrada | + |
| 8 | Recebimento DOC | Entrada | + |
| 9 | Aluguel | Saída | - |

## 🚀 Passos Iniciais

### 🛠️ Dependências

Antes de rodar o projeto, verifique se você possui as seguintes dependências instaladas:

- **Docker**: Para criar e gerenciar os containers da aplicação.
- **Docker Compose**: Para orquestrar os containers e facilitar o processo de execução do ambiente.

### 🔧 Instalação

1. **Clone o repositório** para sua máquina local:
   ```bash
   git clone https://github.com/bergsonsud/desafio-dev.git
   cd desafio-dev

2. **Executar aplicação**:
   ```bash
   ./start.sh

3. **Executar todos os testes** (backend RSpec + frontend Jest):
   ```bash
   ./spec.sh

### 🌐 Links Úteis

#### Local (Desenvolvimento)

- **Aplicação Web**: [http://localhost](http://localhost)  
  Acesse a interface web da aplicação localmente.

- **API**: [http://localhost/api](http://localhost/api)  
  Endereço base para interagir com a API da aplicação.

- **Documentação da API**: [http://localhost/api-docs/index.html](http://localhost/api-docs/index.html)  
  Acesse a documentação interativa da API gerada pelo RSwag.

#### Demo (Em Produção)

- **Aplicação Web**: [http://vps56446.publiccloud.com.br/cnab/](http://vps56446.publiccloud.com.br/cnab/)  
  Acesse a versão demo da aplicação em produção.

---
<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[Rails]: https://img.shields.io/badge/Rails-a40000?style=for-the-badge&logo=RubyonRails&logoColor=white
[Docker]: https://img.shields.io/badge/Docker-0092E6?style=for-the-badge&logo=Docker&logoColor=white
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-2F6792?style=for-the-badge&logo=PostgreSQL&logoColor=white
[Sidekiq]: https://img.shields.io/badge/Sidekiq-F7F7F7?style=for-the-badge&logo=Sidekiq&logoColor=white
[Redis]: https://img.shields.io/badge/Redis-D12B1F?style=for-the-badge&logo=Redis&logoColor=white
