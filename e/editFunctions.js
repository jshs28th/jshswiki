$("#exitBtn").click(function () {

    location.href = "../w/" + $(".documentTitle").text().replace(/ /gi, "%20");
});

$("#saveBtn").click(function () {

    var text1 = $(".inAndOut").val().replace(/\n/g, "<br>");
    alert(text1);
    var text2 = $("#historyNum").text().split("번");
    var text3 = ("\n" + text1 + "\n" + "--h" + text2[0] + "_" + Date.now() + "_익명_몇바이트--<br>");

    $.post("editphp.php",

        { title: $(".documentTitle").text(), txt: text3 },

        function (data, status) {
            if (status == "success") {

                alert("정상적으로 수정되었습니다.");
                location.reload(true);
                location.href = "../w/" + $(".documentTitle").text();

            } else {

                alert("예기치 못한 오류가 발생했습니다. 다시 시도해 주세요.");
            }

        });


});