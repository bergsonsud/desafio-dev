# frozen_string_literal: true

require 'swagger_helper'

RSpec.describe 'V1::Transactions API', type: :request do
  path '/api/v1/transactions' do
    get 'Retrieve all transactions' do
      tags 'Transactions'
      produces 'application/json'

      response '200', 'transactions found' do
        schema type: :array, items: {
          type: :object,
          properties: {
            store_name: { type: :string },
            balance: { type: :number },
            transactions: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id: { type: :integer },
                  description: { type: :string },
                  date: { type: :string, format: :date },
                  value: { type: :number },
                  value_sign: { type: :number },
                  cpf: { type: :string },
                  card: { type: :string },
                  transaction_type: { type: :string }
                },
                required: %w[id description date value value_sign cpf card transaction_type]
              }
            }
          },
          required: %w[store_name balance transactions]
        }

        let!(:store) { create(:store) }
        let!(:transactions) { create_list(:transaction, 3, store: store) }

        run_test!
      end

      response '404', 'not found' do
        run_test!
      end
    end
  end
end
