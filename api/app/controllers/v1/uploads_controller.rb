# frozen_string_literal: true

module V1
  class UploadsController < ApplicationController
    def create
      file = params[:file]
      return render(json: { error: "Arquivo não enviado" }, status: :bad_request) unless file

      file_path = Rails.root.join("tmp", "new_#{file.original_filename}")

      File.open(file_path, "wb") do |f|
        f.write(file.tempfile.read)
      end

      ProcessCnabJob.perform_async(file_path.to_s)

      render(json: { message: "Arquivo processado com sucesso" }, status: :ok)
    end
  end
end
