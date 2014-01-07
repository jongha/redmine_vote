class VoteController < ApplicationController
  unloadable

  before_filter :require_login
  before_filter :find_user, :find_board_and_topic#, :authorize

  def submit
    votes = Votes.new()
    votes.submit(@message.id, @user.id, params[:point])
  end

  def point
    votes = Votes.new()
    @point = votes.point(@message.id)
  end

private
  def find_user
    @user = User.current
  end

  def find_board_and_topic
    begin
      @board = Board.find(params[:board_id])
      @message = @board.topics.find(params[:message_id])

    rescue ActiveRecord::RecordNotFound
      render_404
    end
  end
end
