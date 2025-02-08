# CNAB API

API para importação de arquivos CNAB

## Descrição

API para importação de arquivos CNAB e visualização das transações.

É um fork do projeto [desafio dev] da ByCoders.  Readme original [README-original.md](README-original.md)

# Documentação do CNAB

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

## Feito com
![Rails][Rails]![Docker][Docker]![PostgreSQL][PostgreSQL]![Sidekiq][Sidekiq]![Redis][Redis]

## Passos iniciais

### Dependências

* Docker

### Instalação

* Docker
* docker-compose

### Executando aplicação

```
./start.sh
```

### Executando testes

```
./rspec.sh
```

### Links

* Aplicação http://localhost
* API http://localhost/api
* Documentação da API http://localhost/api-docs

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[Rails]: https://img.shields.io/badge/Rails-a40000?style=for-the-badge&logo=RubyonRails&logoColor=white
[Docker]: https://img.shields.io/badge/Docker-0092E6?style=for-the-badge&logo=Docker&logoColor=white
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-2F6792?style=for-the-badge&logo=PostgreSQL&logoColor=white
[Sidekiq]: https://img.shields.io/badge/Sidekiq-F7F7F7?style=for-the-badge&logo=Sidekiq&logoColor=white
[Redis]: https://img.shields.io/badge/Redis-D12B1F?style=for-the-badge&logo=Redis&logoColor=white
