$(document).ready(function() {
    if($(".controller-messages").length) {
        //console.log(document.URL);
        $("#vote").show();
        $(".vote-point").bind("click", function(event) {
            event.preventDefault();
            var point = $(this).data("point");
            $.ajax({
                type: "POST",
                url: document.URL + "/vote?p=1",
                success: function(data, textStatus, jqXHR) {
                    console.log(data);
                }
            });        
        });
    }
});