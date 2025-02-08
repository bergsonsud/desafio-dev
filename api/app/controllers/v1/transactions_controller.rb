# frozen_string_literal: true

module V1
  class TransactionsController < ApplicationController
    def index
      @stores = Store.includes(:transactions)
    end
  end
end
