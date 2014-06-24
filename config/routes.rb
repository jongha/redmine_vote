# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html

Rails.application.routes.draw do 
  get 'boards/:board_id/topics/:message_id/vote', :to => 'vote#get'
  post 'boards/:board_id/topics/:message_id/vote', :to => 'vote#add'
  get 'boards/:board_id/topics/:message_id/vote_point', :to => 'vote#get_point'
  get 'boards/:board_id/vote/result', :to => 'vote#result'
end
