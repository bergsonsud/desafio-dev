# frozen_string_literal: true

require "rails_helper"

RSpec.describe(CnabParser, type: :module) do
  describe ".parse" do
    context "quando a linha é válida" do
      let(:valid_line) do
        "5202001010001231200042197660653152****9821153453FOO BAR       BAR DO FOO        "
      end

      it "retorna os dados corretos" do
        result = described_class.parse(valid_line)

        expect(result[:store]).to(eq({
          owner: "FOO BAR",
          name: "BAR DO FOO",
        }))
        expect(result[:transaction]).to(eq({
          transaction_type: 5,
          date: Date.parse("2020-01-01"),
          amount: 12312.0,
          cpf: "04219766065",
          card: "3152****9821",
          time: "153453",
        }))
      end
    end

    context "quando a linha contém dados inválidos" do
      let(:invalid_line) do
        "1INVALIDDATE100000000000000001234567890123456123456INVALIDTIME"
      end

      it "lança um erro ParseError" do
        expect do
          described_class.parse(invalid_line)
        end.to(raise_error(CnabParser::ParseError, /Erro ao processar linha/))
      end
    end

    context "quando a linha está faltando dados" do
      let(:incomplete_line) { "1" + " " * 77 }

      it "lança um erro ParseError" do
        expect do
          described_class.parse(incomplete_line)
        end.to(raise_error(CnabParser::ParseError, /Erro ao processar linha/))
      end
    end
  end
end
