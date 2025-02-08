# frozen_string_literal: true

FactoryBot.define do
  factory :transaction do
    association :store
    transaction_type { 1 }
    date { "2025-02-05" }
    amount { "9.99" }
    cpf { Faker::Number.number(digits: 11) }
    card { Faker::Number.number(digits: 16) }
    time { "12345" }
  end
end
