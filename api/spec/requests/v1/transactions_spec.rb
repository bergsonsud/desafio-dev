# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'V1::Transactions', type: :request do
  describe 'GET /v1/transactions' do
    let!(:store) { create(:store) }
    let!(:transactions) { create_list(:transaction, 3, store: store) }

    before do
      get '/v1/transactions', headers: json_headers
    end

    it 'returns a successful response' do
      expect(response).to have_http_status(:success)
    end

    it 'returns the correct store structure' do
      json_response = JSON.parse(response.body)
      expect(json_response).to be_an(Array)
      expect(json_response.first).to include(
                                       'store_name' => store.name,
                                       'balance' => transactions.sum(&:normalized_amount)&.to_f&.to_s
                                     )
    end

    it 'returns transactions for each store' do
      json_response = JSON.parse(response.body)
      expect(json_response.first['transactions'].size).to eq(3)
      expect(json_response.first['transactions'].first).to include(
                                                             'id' => transactions.first.id,
                                                             'description' => transactions.first.to_s,
                                                             'date' => transactions.first.date.to_s,
                                                             'value' => transactions.first.amount&.to_f&.to_s,
                                                             'value_sign' => transactions.first.normalized_amount&.to_f&.to_s,
                                                             'cpf' => transactions.first.cpf,
                                                             'card' => transactions.first.card,
                                                             'transaction_type' => transactions.first.transaction_type
                                                           )
    end
  end
end
