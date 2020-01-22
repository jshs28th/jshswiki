$("#searchBtn").on('click', function () {

    var input = $("#searchTxt").val();

    var s = input.replace(" ", "_");
    
    $(".documentTitle").text(input);

    $(".inAndOut").load("../w/" + s + ".txt", function (file, status) {
        if (status == "error") {

            $(".inAndOut").text("해당하는 문서가 존재하지 않습니다.");
        }

    });
});