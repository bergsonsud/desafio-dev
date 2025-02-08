# frozen_string_literal: true

json.array!(@stores) do |store|
  json.store_name(store.name)
  json.balance(store.transactions.sum(&:normalized_amount))

  json.transactions(store.transactions) do |transaction|
    json.id(transaction.id)
    json.description(transaction.to_s)
    json.date(transaction.date)
    json.value(transaction.amount)
    json.value_sign(transaction.normalized_amount)
    json.cpf(transaction.cpf)
    json.card(transaction.card)
    json.transaction_type(transaction.transaction_type)
  end
end
