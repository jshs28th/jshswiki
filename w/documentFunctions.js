$("#editBtn").click(function(){
    location.href = "../e/" + $(".documentTitle").text().replace(" ", "%20");
})