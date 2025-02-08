# frozen_string_literal: true

class Transaction < ApplicationRecord
  belongs_to :store

  TRANSACTION_TYPES = {
    1 => { description: "Débito", nature: "Entrada", sign: "+" },
    2 => { description: "Boleto", nature: "Saída", sign: "-" },
    3 => { description: "Financiamento", nature: "Saída", sign: "-" },
    4 => { description: "Crédito", nature: "Entrada", sign: "+" },
    5 => { description: "Recebimento Empréstimo", nature: "Entrada", sign: "+" },
    6 => { description: "Vendas", nature: "Entrada", sign: "+" },
    7 => { description: "Recebimento TED", nature: "Entrada", sign: "+" },
    8 => { description: "Recebimento DOC", nature: "Entrada", sign: "+" },
    9 => { description: "Aluguel", nature: "Saída", sign: "-" },
  }.freeze

  validates :transaction_type, presence: true, inclusion: { in: TRANSACTION_TYPES.keys }
  validates :amount, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :store, presence: true

  def normalized_amount
    sign = TRANSACTION_TYPES[transaction_type][:sign] == "+" ? 1 : -1
    amount * sign
  end

  def to_s
    (TRANSACTION_TYPES[transaction_type][:description]).to_s
  end
end
