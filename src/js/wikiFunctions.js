$("#searchBtn").click(function () {

    var input = $("#searchTxt").val();

    var s = input.replace(" ", "%20");

    window.location.replace("http://cameo.zone/test/kch/123/126/137/146/jshswiki/w/" + s);

});