class Votes < ActiveRecord::Base
  unloadable

  def add_vote(message_id, user_id, point = "0")
    votes = Votes.where('message_id = %d and user_id = %d' % [message_id, user_id]).first

    point = point.to_i
    if votes
      votes.point = (votes.point == point)? 0 : point
      votes.save!
    else
      votes = Votes.new
      votes.message_id = message_id
      votes.user_id = user_id
      votes.point = point
      votes.save!
    end

    return get_point(message_id)
  end

  def get_point(message_id)
    return Votes.where('message_id = %d' % message_id).sum(:point)
  end

  def get_points(user_id, message_id)
    return result = {
      "plus" => Votes.where('message_id = %d and point > 0' % message_id).sum(:point),
      "minus" => Votes.where('message_id = %d and point < 0' % message_id).sum(:point),
      "zero" => Votes.where('message_id = %d and point = 0' % message_id).sum(:point),
      "vote" => Votes.where('message_id = %d and user_id = %d' % [message_id, user_id]).sum(:point),
    }
  end
end
