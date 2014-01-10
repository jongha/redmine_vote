class VoteController < ApplicationController
  unloadable

  before_filter :require_login
  before_filter :find_user, :find_board_and_topic#, :authorize
  before_filter :init_votes
  
  def add
    if ['-1', '1'].include? params[:point] then
      @point = @votes.add_vote(@message.id, @user.id, params[:point])
    else
      @point = @votes.get_point(@message.id)
    end
  end

  def get
    @point = @votes.get_point(@message.id)
  end

private
  def init_votes
    @votes = Votes.new
  end
  
  def find_user
    @user = User.current
  end

  def find_board_and_topic
    begin
      @board = Board.find(params[:board_id])
      @message = @board.messages.find(params[:message_id])

    rescue ActiveRecord::RecordNotFound
      render_404
    end
  end
end
