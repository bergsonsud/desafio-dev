Rails.application.routes.draw do
  namespace :v1 do
    resources :transactions, only: [:index]
    post "/upload", to: "uploads#create"
  end
  
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
end
