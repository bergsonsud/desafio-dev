class CreateTransactions < ActiveRecord::Migration[7.2]
  def change
    create_table :transactions do |t|
      t.references :store, null: false, foreign_key: true
      t.integer :transaction_type
      t.date :date
      t.decimal :amount
      t.string :cpf
      t.string :card
      t.string :time

      t.timestamps
    end
  end
end
