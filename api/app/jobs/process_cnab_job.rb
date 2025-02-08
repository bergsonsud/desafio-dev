# frozen_string_literal: true

class ProcessCnabJob
  include Sidekiq::Worker

  def perform(file_path)
    File.readlines(file_path).each do |line|
      process_cnab_line(line)
    end

    File.delete(file_path) if File.exist?(file_path) && !Rails.env.test?
  end

  private

  def process_cnab_line(line)
    cnab = CnabParser.parse(line)
    store = Store.find_or_create_by!(name: cnab[:store][:name], owner: cnab[:store][:owner])
    store.transactions.create!(cnab[:transaction])
  end
end
