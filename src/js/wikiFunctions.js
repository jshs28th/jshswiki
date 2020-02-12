$("#searchBtn").click(function () {

    search();

});

function search() {

    var input = $("#searchTxt").val();

    var s = input.replace(" ", "%20");

    window.location.replace("../w/" + s);

}

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


//로그인 및 회원가입 로그인 및 회원가입 로그인 및 회원가입 로그인 및 회원가입

// 미리 숨기기
$("#loginInput").hide();
$('#signUpInput').hide();
$('#authDiv').hide();

$("#loginBtn").on('click', function () {

    if ($('#loginInput').css('display') != 'none') {

        if (!$('#id').val() && !$('#pw').val()) {

            $("#loginInput").hide();

        } else {

            signIn($('#id').val(), $('#pw').val());
        }

    } else if ($('#signUpInput').css('display') != 'none') {

        if (!$('#nick').val() && !$('#gisu').val()) {

            $("#signUpInput").hide();

        } else {

            signUp($('#nick').val(), $('#gisu').val());
        }

    }else {

        $("#loginInput").show();

    }

});
var firebaseConfig = {
    apiKey: "AIzaSyBo1n7N-LhS5DmtCSRqAIHcDeo6oT-heeA",
    authDomain: "jshswiki.firebaseapp.com",
    databaseURL: "https://jshswiki.firebaseio.com",
    projectId: "jshswiki",
    storageBucket: "jshswiki.appspot.com",
    messagingSenderId: "100649838292",
    appId: "1:100649838292:web:3b24692bb098faedff3d41",
    measurementId: "G-445Q0P6WKK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//로그인
const auth = firebase.auth();
var Email;
var Pw;

function signIn(email, pw) {

    auth.signInWithEmailAndPassword(email, pw).catch(function (error) {
        var errorCode = error.code;
        if (errorCode == 'auth/user-not-found') {
            if (confirm('일치하는 회원정보가 존재하지 않습니다. 계정을 새로 생성하시겠습니까?')) {

                Email = email;
                Pw = pw;
                $('#signUpInput').show();
                $('#loginInput').hide();

            }
        } else {

            alert('오류가 발생했습니다.');
        }
    });

}

//가입
function signUp(Nick, Gisu) {

    auth.createUserWithEmailAndPassword(Email, Pw).catch(error => {if(error.code) { alert(error.code); }}).then(function () {
        userRef.child(Email.split('.').join('%')).set({
            nick: Nick,
            gisu: Gisu,
            level: 0
        });
        alert('전곽위키의 회원이 되신 것을 환영합니다!');
        $('#signUpInput').hide();
    });
}

//정보 불러오기
const userRef = firebase.database().ref('user');
var level = 0;
auth.onAuthStateChanged(function (user) {
    if (user) {
        var email = user.email.split('.').join('%');
        userRef.child(email).once('value', function (snapshot) {
            userInfo = snapshot.val();
            $('#nickTxt').text(userInfo.nick+'('+userInfo.gisu+'기)');
            level = userInfo.level;
        });
        $("#loginInput").hide();
        $('#authDiv').show();
        $('#loginBtn').hide();


    } else {
    }
});

// 로그아웃
$('#auth').on('click', function () {
    if(confirm('로그아웃 하시겠습니까?')) {

        auth.signOut();
        $("#loginInput").show();
        $('#authDiv').hide();
        $('#loginBtn').show();

    }
});