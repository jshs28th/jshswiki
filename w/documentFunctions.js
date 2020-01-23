$("#editBtn").click(function () {
    location.href = "../e/" + $(".documentTitle").text().replace(/ /gi, "%20");
});

$("#historyTxt").hide();


$("#historyBtn").click(function () {

   $("#historyTxt").load($(".documentTitle").text().replace(/ /gi, "%20") + ".txt");
        $(".inAndOut").slideToggle(200);
        $("#historyTxt").slideToggle(200);

});