#!/bin/bash

docker compose run --service-ports --rm -e "RAILS_ENV=test" api bin/rails db:create db:migrate
docker compose run --service-ports --rm -e "RAILS_ENV=test" api bundle exec rspec
