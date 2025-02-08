# frozen_string_literal: true

require 'rails_helper'

RSpec.configure do |config|
  # Specify a root folder where Swagger JSON files are generated
  # NOTE: If you're using the rswag-api to serve API descriptions, you'll need
  # to ensure that it's configured to serve Swagger from the same folder
  config.openapi_root = Rails.root.join('swagger').to_s

  # Define one or more Swagger documents and provide global metadata for each one
  # When you run the 'rswag:specs:swaggerize' rake task, the complete Swagger will
  # be generated at the provided relative path under openapi_root
  # By default, the operations defined in spec files are added to the first
  # document below. You can override this behavior by adding a openapi_spec tag to the
  # the root example_group in your specs, e.g. describe '...', openapi_spec: 'v2/swagger.json'
  config.swagger_docs = {
    'v1/swagger.json' => {
      openapi: '3.0.1',
      info: {
        title: 'Documentação do CNAB',
        version: 'v1',
        description: <<~DESC
          ## 📄 Introdução

          Você recebeu um arquivo **CNAB** com os dados das movimentações financeiras de várias lojas.  
          Precisamos criar uma maneira para que estes dados sejam importados para um banco de dados.  

          **Objetivo**  
          - Criar uma interface web que aceite **upload do arquivo CNAB**  
          - Normalizar os dados e armazená-los em um **banco de dados relacional**  
          - Exibir essas informações na tela  

          ## 📌 Estrutura do Arquivo CNAB

          ```
          | Descrição do campo   | Início | Fim  | Tamanho | Comentário |
          |----------------------|--------|------|---------|------------|
          | Tipo                 | 1      | 1    | 1       | Tipo da transação |
          | Data                 | 2      | 9    | 8       | Data da ocorrência |
          | Valor                | 10     | 19   | 10      | Valor da movimentação (divida por 100) |
          | CPF                  | 20     | 30   | 11      | CPF do beneficiário |
          | Cartão               | 31     | 42   | 12      | Cartão utilizado na transação |
          | Hora                 | 43     | 48   | 6       | Hora da ocorrência (UTC-3) |
          | Dono da loja         | 49     | 62   | 14      | Nome do representante da loja |
          | Nome loja            | 63     | 81   | 19      | Nome da loja |
          ```

          ## 📌 Tipos de Transações

          ```
          | Tipo | Descrição                | Natureza | Sinal |
          |------|--------------------------|----------|-------|
          | 1    | Débito                   | Entrada  | +     |
          | 2    | Boleto                   | Saída    | -     |
          | 3    | Financiamento            | Saída    | -     |
          | 4    | Crédito                  | Entrada  | +     |
          | 5    | Recebimento Empréstimo   | Entrada  | +     |
          | 6    | Vendas                   | Entrada  | +     |
          | 7    | Recebimento TED          | Entrada  | +     |
          | 8    | Recebimento DOC          | Entrada  | +     |
          | 9    | Aluguel                  | Saída    | -     |
          ```

        DESC
      },
      paths: {},
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Servidor Local'
        }
      ]
    }
  }
end
