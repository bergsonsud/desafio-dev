# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Transactions API", type: :request do
  path "/v1/transactions" do
    get "Lista todas as lojas com suas transações" do
      tags "Transactions"
      produces "application/json"

      response "200", "Lista de lojas com transações" do
        schema type: :array,
               items: {
                 type: :object,
                 properties: {
                   store_name: { type: :string },
                   balance: { oneOf: [{ type: :number }, { type: :string }] },
                   transactions: {
                     type: :array,
                     items: {
                       type: :object,
                       properties: {
                         id: { type: :integer },
                         description: { type: :string },
                         date: { type: :string, format: :date },
                         value: { oneOf: [{ type: :number }, { type: :string }] },
                         value_sign: { oneOf: [{ type: :number }, { type: :string }] },
                         cpf: { type: :string },
                         card: { type: :string },
                         transaction_type: { type: :integer }
                       }
                     }
                   }
                 },
                 required: %w[store_name balance transactions]
               }

        let!(:store) { Store.create!(name: "Loja Teste", owner: "Dono Teste") }
        let!(:transaction1) do
          store.transactions.create!(
            transaction_type: 1,
            date: "2025-02-06",
            amount: 1420,
            cpf: "09620676017",
            card: "4753****3153",
            time: "153453"
          )
        end

        run_test! do |response|
          json = JSON.parse(response.body)
          expect(json).to be_an(Array)
          expect(json.first["store_name"]).to eq("Loja Teste")
          expect(json.first["transactions"].length).to eq(1)
          expect(json.first["balance"].to_f).to eq(1420.0)
        end
      end
    end
  end
end
