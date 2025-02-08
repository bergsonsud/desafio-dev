# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Uploads API", type: :request do
  path "/v1/upload" do
    post "Faz o upload de um arquivo CNAB e inicia o processamento" do
      tags "Uploads"
      consumes "multipart/form-data"
      produces "application/json"
      parameter name: :file,
                in: :formData,
                schema: { type: :object,
                          properties: {
                            file: { type: :file }
                          }
                }

      response "200", "Arquivo processado com sucesso" do
        let(:file) { fixture_file_upload(Rails.root.join("spec/fixtures/files/CNAB.txt"), "text/plain") }

        before do
          post "/v1/upload", params: { file: file }, headers: { "Content-Type" => "multipart/form-data" }
        end

        run_test! do |response|
          expect(response.status).to eq(200)
        end
      end

      response "400", "Arquivo não enviado" do
        let(:file) { nil }

        run_test! do |response|
          expect(response.status).to eq(400)
        end
      end
    end
  end
end
