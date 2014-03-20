require 'redmine'
require 'vote_application_hooks'

Redmine::Plugin.register :redmine_vote do
  name 'Redmine Vote plugin'
  author 'Jong-Ha Ahn'
  description 'This is a plugin for Redmine'
  version '1.0.1'
  url 'http://github.com/jongha/redmine_vote'
  author_url 'http://www.mrlatte.net'
end