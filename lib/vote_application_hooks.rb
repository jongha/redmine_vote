class VoteHeaderHooks < Redmine::Hook::ViewListener

  def view_layouts_base_html_head(context = {})
    o = stylesheet_link_tag('vote', :plugin => 'redmine_vote')
    o << javascript_include_tag('vote', :plugin => 'redmine_vote')
    return o
  end
end

class VoteLayoutBaseContentHooks < Redmine::Hook::ViewListener
  render_on :view_layouts_base_content, :partial => 'vote/view_layouts_base_content'
end