# frozen_string_literal: true

class Store < ApplicationRecord
  has_many :transactions

  def balance
    transactions.sum(&:normalized_amount)
  end
end
