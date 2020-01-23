$("#exitBtn").click(function(){

    location.href = "../w/" + $(".documentTitle").text().replace(" ", "%20");
});

$("#saveBtn").click(function () {

    $.post("editphp.php",
    
    { title: $(".documentTitle").text(), txt: $(".inAndOut").val()},
    
    function (data, status) {
        document.location.href = 'http://cameo.zone/test/kch/123/126/137/146/jshswiki/e/' + $(".documentTitle").text();
    });
    
    
});