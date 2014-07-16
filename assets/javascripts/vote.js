$(document).ready(function() {
    var baseObj = $("#vote-base-url");
    var base = "";

    if(baseObj.length > 0) {
      base = baseObj.val();
    }

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
            var votePoint = vote.find(".vote-point:first");
            var voteCheck = vote.find(".vote-check:first");
            
            $.ajax({
                type: "GET",
                url: base + "boards/" + board + "/topics/" + topic + "/vote",
                cache: false,
                error: function(jqXHR, textStatus, errorThrown) {
                    votePoint.html("-");
                },
                success: function(data, textStatus, jqXHR) {
                    votePoint.html(data.point);
                    voteCheck.html(data.vote ? "☑" : "✅");
                }

            }).always(function() {
                deferred.always();

                vote.find(".vote-button").bind("click", function(event) {
                    event.preventDefault();
                    var point = $(this).data("point");
                    $.ajax({
                        type: "POST",
                        url: base + "boards/" + board + "/topics/" + topic + "/vote",
                        data: { point: point },
                        cache: false,
                        success: function(data, textStatus, jqXHR) {
                            votePoint.html(data.point);
                            voteCheck.html(data.vote ? "☑" : "✅");
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
          url: base + "boards/" + match[1] + "/vote/result",
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
            url: base + "boards/" + _board + "/topics/" + _topic + "/vote",
            cache: false,
            success: function(data, textStatus, jqXHR) {
              _this.html(data.point);
            }
          });
        }
      });
    }
});
