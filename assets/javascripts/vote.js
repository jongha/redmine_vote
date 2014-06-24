$(document).ready(function() {
    if($(".controller-messages").length && $("#vote").length) {
        var clr = $("<div></div>").css({ clear: "right" });
        var queue = [];
        $(".message").each(
            function() {
                queue.push($(this));
            }
        );

        var execQueue = function() {
            if(queue.length) {
                queueStep(queue.shift());
            }
        };

        var queueStep = function(that) {
            var deferred = $.Deferred();
            var messageId = that.attr("id");
            var vote = $("#vote").clone().show().attr({ id: null });
            if(messageId) {
                vote.data({ topic: parseInt(String(messageId).replace(/message-/gi, "")) });
            }
            that.css({ "clear": "both" }).prepend(vote);

            var board = vote.data("board");
            var topic = vote.data("topic");
            var voteButtons = vote.find(".vote-button");
            var voteSummary = vote.find(".vote-point-total");

            var setButton = function(summary, buttons, data) {

              if(data) {
                  var i;
                  for(i=0; i<buttons.length; ++i) {
                      var button = $(voteButtons[i]);
                      var type = button.data("point");

                      var point = "-";
                      if(data.vote !== null && type === data.vote) {
                          button.removeClass("disabled");
                      }else {
                          button.addClass("disabled");
                      }

                      switch(type) {
                        case 1: point = data.plus; break;
                        case 0: point = data.zero; break;
                        case -1: point = -data.minus; break;
                        default: break;
                      }

                      button.find(".vote-point").html(point);
                  }

                  if(summary) {
                      summary.html(data.point);
                  }
              }
            };

            $.ajax({
                type: "GET",
                url: "/boards/" + board + "/topics/" + topic + "/vote",
                cache: false,
                error: function(jqXHR, textStatus, errorThrown) {
                    vote.find(".vote-point").html("-");
                },
                success: function(data, textStatus, jqXHR) {
                    setButton(voteSummary, voteButtons, data);
                }

            }).always(function() {
                deferred.always();

                vote.find(".vote-button").bind("click", function(event) {
                    event.preventDefault();
                    var point = $(this).data("point");
                    $.ajax({
                        type: "POST",
                        url: "/boards/" + board + "/topics/" + topic + "/vote",
                        data: { point: point },
                        cache: false,
                        success: function(data, textStatus, jqXHR) {
                            setButton(voteSummary, voteButtons, data);
                        }
                    });
                });

                execQueue();
            });
            return deferred.promise();
        };
        execQueue();
    };

    var re = /https?:\/\/.*\/projects\/.*\/boards\/([0-9]*)/;
    var url = document.URL;
    var match = url.match(re);
    var result = "#vote-result";

    if(match) {
      $("<div></div>")
        .attr("id", "vote-result-box")
        .insertAfter($("#content").find("p.breadcrumb"));

      $.ajax({
          type: "GET",
          url: "/boards/" + match[1] + "/vote/result",
          cache: false,
          success: function(data, textStatus, jqXHR) {
            if($(result).length === 0) {
              var html = $(data).find(result).html();
              if(html) {
                $("#vote-result-box").addClass("vote-result").html(html);
              }else {
                $("#vote-result-box").remove();
              }
            }
          }
      });

      var table = $("table.list.messages");

      $("<th></th>")
        .html($("#label_vote_count").text())
        .insertAfter(table.find("thead > tr > th:nth-child(3)"));

      $("<td></td>")
        .addClass("vote-td-trigger")
        .insertAfter(table.find("tbody > tr > td:nth-child(3)"));

      $("td.vote-td-trigger").each(function() {
        var _re = /\/boards\/([0-9]*)\/topics\/([0-9]*)/;
        var _href = $(this).parent().find("td.subject > a").attr("href");
        var _match = _href.match(_re);
        if(_match) {
          var _board = _match[1];
          var _topic = _match[2];
          var _this = $(this);
          $.ajax({
            type: "GET",
            url: "/boards/" + _board + "/topics/" + _topic + "/vote_point",
            cache: false,
            success: function(data, textStatus, jqXHR) {
              _this.html(data.point);
            }
          });
        }
      });
    }
});