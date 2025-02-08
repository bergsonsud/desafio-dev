# frozen_string_literal: true

require "simplecov"

SimpleCov.start("rails") do
  add_group "Controllers", "app/controllers"
  add_group "Models", "app/models"
  add_group "Jobs", "app/jobs"
  add_group "Libs", "lib"

  # Ignore folders
  add_filter "app/channels"
  add_filter "app/mailers"
  add_filter "app/models/application_record.rb"
  add_filter "app/models/user.rb"
  add_filter "app/helpers"
  add_filter "app/jobs/application_job.rb"
  add_filter "app/controllers/application_controller.rb"
end
