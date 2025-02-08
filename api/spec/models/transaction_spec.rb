# frozen_string_literal: true

require "rails_helper"

RSpec.describe(Transaction, type: :model) do
  describe "associações" do
    it { is_expected.to(belong_to(:store)) }
  end

  describe "validações" do
    it { is_expected.to(validate_presence_of(:transaction_type)) }
    it { is_expected.to(validate_inclusion_of(:transaction_type).in_array(Transaction::TRANSACTION_TYPES.keys)) }
    it { is_expected.to(validate_presence_of(:amount)) }
    it { is_expected.to(validate_numericality_of(:amount).is_greater_than_or_equal_to(0)) }
    it { is_expected.to(validate_presence_of(:store)) }
  end

  describe "constantes" do
    it "define TRANSACTION_TYPES corretamente" do
      expect(Transaction::TRANSACTION_TYPES).to(be_a(Hash))
      expect(Transaction::TRANSACTION_TYPES.keys).to(contain_exactly(1, 2, 3, 4, 5, 6, 7, 8, 9))
    end

    it "tem a descrição e o sinal corretos para cada tipo de transação" do
      Transaction::TRANSACTION_TYPES.each do |_type, details|
        expect(details).to(include(:description, :nature, :sign))
      end
    end
  end

  describe "#normalized_amount" do
    let(:store) { create(:store) }

    context 'quando o tipo de transação é "Débito" (tipo 1)' do
      let(:transaction) { create(:transaction, store: store, transaction_type: 1, amount: 100.0) }

      it "retorna o valor normalizado correto" do
        expect(transaction.normalized_amount).to(eq(100.0))
      end
    end

    context 'quando o tipo de transação é "Boleto" (tipo 2)' do
      let(:transaction) { create(:transaction, store: store, transaction_type: 2, amount: 50.0) }

      it "retorna o valor normalizado correto" do
        expect(transaction.normalized_amount).to(eq(-50.0))
      end
    end

    context 'quando o tipo de transação é "Crédito" (tipo 4)' do
      let(:transaction) { create(:transaction, store: store, transaction_type: 4, amount: 200.0) }

      it "retorna o valor normalizado correto" do
        expect(transaction.normalized_amount).to(eq(200.0))
      end
    end
  end

  describe "#to_s" do
    let(:store) { create(:store) }

    it "retorna a descrição correta para o tipo de transação" do
      transaction = create(:transaction, store: store, transaction_type: 1)
      expect(transaction.to_s).to(eq("Débito"))
    end

    it 'retorna a descrição correta para "Boleto" (tipo 2)' do
      transaction = create(:transaction, store: store, transaction_type: 2)
      expect(transaction.to_s).to(eq("Boleto"))
    end
  end

  describe "criação" do
    let(:store) { create(:store) }

    context "quando todos os atributos são válidos" do
      it "cria a transação com sucesso" do
        transaction = build(:transaction, store: store, transaction_type: 1, amount: 100.0)
        expect(transaction).to(be_valid)
        expect(transaction.save).to(be_truthy)
      end
    end

    context "quando o valor é inválido" do
      it "não é válido se o valor for negativo" do
        transaction = build(:transaction, store: store, transaction_type: 1, amount: -100.0)
        expect(transaction).not_to(be_valid)
      end

      it "não é válido se o valor for nulo" do
        transaction = build(:transaction, store: store, transaction_type: 1, amount: nil)
        expect(transaction).not_to(be_valid)
      end
    end

    context "quando o tipo de transação é inválido" do
      it "não é válido se o tipo de transação não estiver incluído nos tipos predefinidos" do
        transaction = build(:transaction, store: store, transaction_type: 99, amount: 100.0)
        expect(transaction).not_to(be_valid)
      end
    end
  end
end
