# frozen_string_literal: true

require "rails_helper"

RSpec.describe("Uploads API", type: :request) do
  describe "POST /uploads" do
    let(:file_path) { Rails.root.join("spec/fixtures/files/CNAB.txt") }
    let(:uploaded_file) { fixture_file_upload(file_path, "text/plain") }

    context "quando o arquivo é enviado corretamente" do
      it "retorna sucesso e enfileira o processamento" do
        expect(ProcessCnabJob).to(receive(:perform_async).with(Rails.root.join("tmp/new_CNAB.txt").to_s))

        post "/v1/upload", params: { file: uploaded_file }

        expect(response).to(have_http_status(:ok))
        expect(JSON.parse(response.body)).to(eq({ "message" => "Arquivo processado com sucesso" }))
      end
    end

    context "quando nenhum arquivo é enviado" do
      it "retorna erro e status 400" do
        post "/v1/upload", params: {}

        expect(response).to(have_http_status(:bad_request))
        expect(JSON.parse(response.body)).to(eq({ "error" => "Arquivo não enviado" }))
      end
    end
  end
end
