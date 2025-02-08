class CreateStores < ActiveRecord::Migration[7.2]
  def change
    create_table :stores do |t|
      t.string :name
      t.string :owner

      t.timestamps
    end
  end
end
