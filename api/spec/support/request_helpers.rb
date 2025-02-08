# frozen_string_literal: true

module RequestHelpers
  def json_headers
    {
      "ACCEPT" => "application/json",
      "HTTP_ACCEPT" => "application/json",
    }
  end
end

RSpec.configure do |config|
  config.include(RequestHelpers, type: :request)
end
