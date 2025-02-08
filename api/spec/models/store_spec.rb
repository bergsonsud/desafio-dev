# frozen_string_literal: true

require "rails_helper"

RSpec.describe(Store, type: :model) do
  describe "associations" do
    it { is_expected.to(have_many(:transactions)) }
  end

  describe "#balance" do
    let(:store) { create(:store) }
    let!(:transaction_1) { create(:transaction, store: store, amount: 100.0) }
    let!(:transaction_2) { create(:transaction, store: store, amount: 50.0) }
    let!(:transaction_3) { create(:transaction, store: store, amount: 30.0) }

    it "calcula o saldo correto para a loja" do
      expect(store.balance).to(eq(180.0))
    end

    it "retorna 0 se não houver transações" do
      store_without_transactions = create(:store)
      expect(store_without_transactions.balance).to(eq(0.0))
    end
  end
end
