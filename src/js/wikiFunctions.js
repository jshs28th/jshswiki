$("#searchBtn").click(function () {

    var input = $("#searchTxt").val();

    var s = input.replace(" ", "%20");

    window.location.replace("http://cameo.zone/test/kch/123/126/137/146/jshswiki/w/" + s);

});

function loadLog() {

    $.post("../src/js/logphp.php", { name: 'log' }, function (data, status) {

        var log = data.split('\n');

        log.reverse();

        for (var i = 1; i < 11; i++) {

            var j = log[i - 1].split('--h');
            $("#link" + (i)).text(j[0]);
            $("#link" + (i)).attr('href', '../w/' + j[0]);
        }

    });

}

$("#uploadBtn").on('click', function () {

    if (confirm("파일을 업로드 하시겠습니까?")) {

        var data = new FormData($('#uploadForm')[0]);

        data.append("file", $('#file')[0].files[0]);

        console.log(data);

        $.ajax({

            type: "POST",

            enctype: 'multipart/form-data',

            url: "../src/js/uploadphp.php",

            data: data,

            processData: false,

            contentType: false,

            cache: false,

            timeout: 600000,

            success: function (result) {

                console.log("SUCCESS : ", result.data);

            },

            error: function (e) {

                console.log("ERROR : ", e);

            }

        });
    }
});

$("#uploadDiv").hide();

$("#upload").on("click", function () {

    $("#uploadDiv").toggle();

});

$("#loginInput").hide();

$("#loginBtn").on('click', function () {

    if($('#loginInput').css('display') != 'none'){

        if (!$('#id').val() && !$('#pw').val()) {
    
            $("#loginInput").hide();
    
        } else {
    
            signIn($('#id').val(), $('#pw').val());
        }

    } else {

        $("#loginInput").show();

    }

});

function signIn (id, pw) {

    alert(id+pw);

}

function signUp (id, pw) {


}