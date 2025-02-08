# frozen_string_literal: true

require "rails_helper"

RSpec.describe(ProcessCnabJob, type: :job) do
  let(:file_path) { Rails.root.join("spec/fixtures/files/CNAB.txt") }

  before do
    File.open(file_path, "w") do |file|
      file.write("5202001010001231200042197660653152****9821153453FOO BAR       BAR DO FOO        ")
    end
  end

  describe "#perform" do
    it "processa a linha do arquivo e cria uma Store e Transaction" do
      described_class.new.perform(file_path)
      expect(Store.count).to(eq(1))
      expect(Transaction.count).to(eq(1))
    end
  end
end
