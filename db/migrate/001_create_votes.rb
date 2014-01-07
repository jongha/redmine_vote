class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.integer :message_id
      t.integer :user_id
      t.integer :point
    end
  end
end
