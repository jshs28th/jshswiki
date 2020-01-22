$("#searchBtn").on('click', function () {

    var s = $("#searchTxt").val();

    $(".documentTitle").text(s);

    $("#paragraph").load("../w/main.txt");


});