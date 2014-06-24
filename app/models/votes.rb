class Votes < ActiveRecord::Base
  unloadable

  def add_vote(message_id, user_id, point = 0)
    votes = Votes.find(:first, :conditions => ['message_id = ? and user_id = ?', message_id, user_id])
    if votes
      votes.point = point.nil? ? 0 : point
      votes.save!
    else
      votes = Votes.new
      votes.message_id = message_id
      votes.user_id = user_id
      votes.point = point.nil? ? 0 : point
      votes.save!
    end
    
    return get_point(message_id)
  end

  def get_point(message_id)
    return Votes.sum(:point, :conditions => ['message_id = ?', message_id])
  end

  def get_points(user_id, message_id, simple = false)
    if simple
      return result = {
        "point" => Votes.sum(:point, :conditions => ['message_id = ?', message_id]),
      }
      
    else
      owner = Votes.find(:first, :conditions => ['message_id = ? and user_id = ?', message_id, user_id])
      
      return result = {
        "plus" => Votes.sum(:point, :conditions => ['message_id = ? and point > 0', message_id]),
        "minus" => Votes.sum(:point, :conditions => ['message_id = ? and point < 0', message_id]),
        "zero" => Votes.count(:point, :conditions => ['message_id = ? and point = 0', message_id]),
        "vote" => owner.nil? ? nil : owner.point,
      }
    end
  end  
end
