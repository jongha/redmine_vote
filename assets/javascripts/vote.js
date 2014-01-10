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
            var votePoint = vote.find(".vote-point:first");
            
            $.ajax({
                type: "GET",
                url: "/boards/" + board + "/topics/" + topic + "/vote",
                cache: false,
                error: function(jqXHR, textStatus, errorThrown) {
                    votePoint.html("-");
                },
                success: function(data, textStatus, jqXHR) {
                    votePoint.html($(data).find("#vote-point").html());
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
                            votePoint.html($(data).find("#vote-point").html());
                        }
                    });
                });
        
                execQueue();
            });
            return deferred.promise();
        };
        execQueue();
    }
});