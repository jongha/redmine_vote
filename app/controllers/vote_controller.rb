class VoteController < ApplicationController
  unloadable

  before_filter :require_login
  before_filter :find_user #, :authorize
  before_filter :init_votes

  MAX_VOTELIST = 5
  
  def add
    find_board_and_topic
    
    if ['-1', '1'].include? params[:point] then
      @point = @votes.add_vote(@message.id, @user.id, params[:point])
    else
      @point = @votes.get_point(@message.id)
    end
  end

  def get
    find_board_and_topic
    
    @point = @votes.get_point(@message.id)
  end
  
  def result
    @board = Board.find(params[:board_id])
    @votes = Votes\
      .select('message_id, sum(point) as sump')\
      .joins('right join messages on votes.message_id = messages.id and messages.parent_id is null')\
      .group('message_id')\
      .order('sum(point) desc, messages.id desc')\
      .limit(MAX_VOTELIST + 1)

    messages = Array.new
    @votes_message = {}
    @votes.each do |v|
      messages.push(v.message_id)
      @votes_message[v.message_id] = v.sump
    end
    
    @message = @board.messages\
      .joins('inner join (select message_id, sum(point) as sump from votes group by message_id) as votes on messages.id = votes.message_id')\
      .where('messages.id' => messages)\
      .reorder('votes.sump desc, messages.id desc')
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
