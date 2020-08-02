

function abc() {
    userLoop(0).then(() => {
        console.log('done');
    })
}

function userLoop(i) {
    return new Promise(resolve => {
        if (autoDocList[i] == undefined) {
            resolve();
        } else {
            if (autoDocList[i].search(/.+\(28기\)/g) != -1) {
                firebase.firestore().collection('document').doc('user').collection(autoDocList[i]).orderBy('history', 'desc').limit(1).get().then(snap => {
                    firebase.firestore().collection('document').doc('user').collection(autoDocList[i]).doc(snap.docs[0].id).update({
                        private: true
                    }).then(() => {
                        console.log(autoDocList[i]);
                        userLoop(i + 1).then(() => {
                            resolve();
                        });
                    });
                });
            } else {
                userLoop(i + 1).then(() => {
                    resolve();
                });
            }
        }
    });
}





//로딩중 함수
var load = 0;
function loading(now) {
    if (now) {

        if (load == 0) {
            //로딩시작
            //console.log('loading start');
            $('#uploadDiv').css('opacity', 0);


            $('#loginDiv').removeClass('hidden');
        }
        load = load + 1;
        //console.log(load);
    } else {
        load = load - 1;
        //console.log(load);
        if (load == 0) {

            //console.log('loading end');
            $('#uploadDiv').css('opacity', 1);

            //$('#loginDiv').addClass('hidden');
            MathJax.Hub.Configured();
        }
    }
}

//바이트 구하는 함수
function getByteLength(s, b, i, c) {
    for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
    return b;
}

//신고 확인하기
function checkReport() {
    checkLevel().then(() => {
        if (userLevel >= 15) {
            reportRef.once('value', function (snapshot) {
                snapshot.forEach(function (value) {
                    console.log(value.key);
                    console.log(value.val());
                });
            });
        }
    });
}

//신고 삭제하기 (완료된 신고처리)
function deleteReport(time) {
    checkLevel().then(() => {
        if (userLevel >= 15) {
            reportRef.child(time).set(null).then(() => {
                console.log('완료');
            });
        }
    });
}

//경고 주기
function addWarn() {
    checkLevel().then(() => {
        if (userLevel >= 15) {
            var name = prompt('본명?');
            var gisu = prompt('기수?');
            userRef.child(gisu).child(name).child('warn').once('value', function (warn) {
                userRef.child(gisu).child(name).child('warn').set(warn.val() + 1).then(() => {
                    console.log(name + '의 경고를 ' + Number(warn.val() + 1) + '로 바꾸었습니다.');
                });
            });
        }
    });
}

//검색 관련 작업들!//검색 관련 작업들!//검색 관련 작업들!//검색 관련 작업들!//검색 관련 작업들!//검색 관련 작업들!
$("#searchBtn").click(function () {
    search();
});

function search() {

    if (autoCompleteNum == 0) {
        var inputT = $("#searchTxt").val();
        var autoT = $("#auto_1>a").text();
        if (inputT.toUpperCase().replace(/ /g, '') == autoT.toUpperCase().replace(/ /g, '')) {
            var input = $("#auto_1>a").text();
        } else {
            var input = $("#searchTxt").val();
        }
    } else {
        var input = $("#auto_" + autoCompleteNum + '>a').text();
    }

    var s = input.replace(" ", "%20");

    window.location.replace("../w/" + s);

}


var autoCompleteNum = 0;
function autoUpDown(kc) {

    if (kc == 13) {
        //엔터
        search();
    } else if (kc == 38) {
        //위 방향키
        if (autoCompleteNum > 1) {
            $('#auto_' + autoCompleteNum).removeClass('choiceUpDown');
            autoCompleteNum -= 1;
            $('#auto_' + autoCompleteNum).addClass('choiceUpDown');
        } else if (autoCompleteNum == 1) {
            autoCompleteNum -= 1;
            $('#auto_1').removeClass('choiceUpDown');
            $('#searchTxt')[0].setSelectionRange(0, $('#searchTxt').val().length);
        }
    } else if (kc == 40) {
        //아래 방향키
        if ($('#auto_' + Number(autoCompleteNum + 1)).length == 1) {
            console.log('#auto_' + Number(autoCompleteNum + 1));
            console.log($('#auto_' + Number(autoCompleteNum + 1)).length);
            if (autoCompleteNum == 0) {
                autoCompleteNum += 1;
                $('#auto_' + autoCompleteNum).addClass('choiceUpDown');
            } else {
                $('#auto_' + autoCompleteNum).removeClass('choiceUpDown');
                autoCompleteNum += 1;
                $('#auto_' + autoCompleteNum).addClass('choiceUpDown');
            }
        }
    }
}

//검색어 자동 완성
var autoDocList = new Array();
$(document).ready(function () {
    $.post('../src/php/auto.php', function (documents) {

        autoDocList = documents.split(' ').sort();

    });
});

var matchList;
//propertychange change keyup paste input
$('#searchTxt').on("change keyup paste", function () {
    var keycode = event.keyCode;
    console.log(keycode);
    if (keycode != 40 && keycode != 38) {
        //$(this).focusout();
        autoCompleteNum = 0;
        $('#auto_1').remove();
        $('#auto_2').remove();
        $('#auto_3').remove();
        $('#auto_4').remove();
        $('#auto_5').remove();
        $('#auto_6').remove();

        var input = $('#searchTxt').val();

        if (input != '') {
            //console.log("현재 검색어 => "+input);
            matchList = new Array();
            //var matchRangeList = new Array();
            for (var i = 0; autoDocList.length > i; i++) {

                if (Hangul.search(autoDocList[i].replace(/%20/g, '').toUpperCase(), input.replace(/ /g, '').toUpperCase()) != -1) {
                    matchList.push(autoDocList[i]);
                    //console.log(matchList);
                    //matchRangeList.push(Hangul.rangeSearch(autoDocList[i], input.replace(/ /g, '%20')));
                }

                if (matchList.length >= 6) {
                    break;
                }
            }

            matchList.forEach(function (val, index) {

                var width = window.innerWidth || document.body.clientWidth;
                var top = 0;
                if (width <= 800) {
                    top = index * 4.2 + 16;
                } else {
                    top = index * 4.5 + 13;
                }
                $('#searchDiv').append('<div id="auto_' + (index + 1) + '" style="top:' +
                    top + 'rem;"><a href="../w/' + val + '">' +
                    val.replace(/%20/g, ' ') + '</a></div>');
            });
        }
    } else if (keycode == 40) {
        //이상하게도 오류가 생겨서 필요함.
        if (autoCompleteNum == 0) {
            if (!$('#auto_1').hasClass('choiceUpDown')) {
                autoUpDown(40);
            }
        }

    }
});

var autoHref;

$(document).on("mouseenter", "div[id^=auto]", function () {
    $(this).children('a').addClass('autoHover');
    autoHref = $('.autoHover').attr('href');
});

$(document).on("mouseleave", "div[id^=auto]", function () {
    $(this).children('a').removeClass('autoHover');
    autoHref = $('.autoHover').attr('href');
});


$(document).on('blur', '#searchTxt', function () {
    if (autoHref != undefined) {
        location.href = autoHref;
    } else {
        $('#auto_1').remove();
        $('#auto_2').remove();
        $('#auto_3').remove();
        $('#auto_4').remove();
        $('#auto_5').remove();
        $('#auto_6').remove();
    }
});

$(document).on('focus', '#searchTxt', function () {
    if (matchList != undefined) {
        matchList.forEach(function (val, index) {

            var width = window.innerWidth || document.body.clientWidth;
            var top = 0;
            if (width <= 800) {
                top = index * 4.2 + 16;
            } else {
                top = index * 4.5 + 13;
            }

            $('#searchDiv').append('<div id="auto_' + (index + 1) + '" style="top:' +
                top + 'rem;"><a href="../w/' + val + '">' +
                val.replace(/%20/g, ' ') + '</a></div>');
        });
    }
});


//랜덤문서
$('#randomLabel').on('click', function () {

    if (!$('#randomInput').is(':checked')) {
        $('#randomDiv').children().remove();
        var count = autoDocList.length;

        var width = window.innerWidth || document.body.clientWidth;
        if (width <= 600) {
            var randomDoc = autoDocList[Math.floor(Math.random() * (count))];
            if (randomDoc == '') {
                randomDoc = '전곽위키:대문';
            }
            $('#randomDiv').append('<p style="margin:0 2rem" onclick="location.replace(`../w/' + randomDoc.replace(/%20/g, ' ') + '`);">'
                + randomDoc.replace(/%20/g, ' ') + '</p>');
        } else if (width <= 800) {
            for (var i = 0; i < 2; i++) {
                var randomDoc = autoDocList[Math.floor(Math.random() * (count))];
                if (randomDoc == '') {
                    randomDoc = '전곽위키:대문';
                }

                if (i == 0) {
                    $('#randomDiv').append('<p style="margin-left: 2rem" onclick="location.replace(`../w/' + randomDoc.replace(/%20/g, ' ') + '`);">'
                        + randomDoc.replace(/%20/g, ' ') + '</p>');
                } else if (i == 1) {
                    $('#randomDiv').append('<p style="margin:0 2rem" onclick="location.replace(`../w/' + randomDoc.replace(/%20/g, ' ') + '`);">'
                        + randomDoc.replace(/%20/g, ' ') + '</p>');
                }
            }
        } else {
            for (var i = 0; i < 3; i++) {
                var randomDoc = autoDocList[Math.floor(Math.random() * (count))];
                if (randomDoc == '') {
                    randomDoc = '전곽위키:대문';
                }

                if (i == 0 || i == 2) {
                    $('#randomDiv').append('<p style="margin: 0 2rem" onclick="location.replace(`../w/' + randomDoc.replace(/%20/g, ' ') + '`);">'
                        + randomDoc.replace(/%20/g, ' ') + '</p>');
                } else if (i == 1) {
                    $('#randomDiv').append('<p onclick="location.replace(`../w/' + randomDoc.replace(/%20/g, ' ') + '`);">'
                        + randomDoc.replace(/%20/g, ' ') + '</p>');
                }
            }
        }
        //location.replace('../w/' + randomDoc.replace(/%20/g, ' '));
    }
});

//서버작업//서버작업//서버작업//서버작업//서버작업//서버작업//서버작업//서버작업//서버작업//서버작업
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
//firebase.firestore().enablePersistence();

var jshsusConfig = {
    apiKey: "AIzaSyDqRx5NGq7WqSNviytOnGg-_8QYRLqXYBw",
    authDomain: "jshsus-6144b.firebaseapp.com",
    databaseURL: "https://jshsus-6144b.firebaseio.com",
    projectId: "jshsus-6144b",
    storageBucket: "jshsus-6144b.appspot.com",
    messagingSenderId: "709620057314"
};

var jshsus = firebase.initializeApp(jshsusConfig, "other");


//로그인
const auth = jshsus.auth();
var Email;
var Pw;

const jshsusUser = jshsus.database().ref('USER');

function signIn(id, pw) {

    if (id == "" || pw == "") {
        logErr("모든 항목을 채워 주세요.");
    } else {
        //var continuelogged = $('#loginContinueCheck').is(':checked');
        var emailCheckRegex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

        $('#signInDiv').addClass('hidden');
        $('#authLoadDiv').removeClass('hidden');
        if (emailCheckRegex.test(id)) {
            realLogIn(id, pw);
        } else {
            jshsusUser.child('ID/' + id).once('value', function (snapshot) {
                if (snapshot.val() == null) {
                    alert('일치하는 회원정보가 존재하지 않습니다.\n전곽위키는 과구리의 계정과 연동됩니다.\n아직 과구리에 가입하지 않으셨다면 가입하고 다시 로그인 해 보세요.');
                    $('#signInDiv').removeClass('hidden');
                    $('#authLoadDiv').addClass('hidden');
                } else {
                    realLogIn(snapshot.val().email, pw);
                }
            });
        }
    }
}

function realLogIn(email, pw) {
    auth.signInWithEmailAndPassword(email, pw).catch(function (error) {
        // Handle Errors here.
        if (error.code == "auth/wrong-password") {
            alert('아이디 또는 비밀번호가 일치하지 않습니다.');
        } else if (error.code == "auth/user-not-found") {
            alert('일치하는 회원정보가 존재하지 않습니다.\n전곽위키는 과구리의 계정과 연동됩니다.\n아직 과구리에 가입하지 않으셨다면 가입하고 다시 로그인 해 보세요.');
        } else {
            alert('예기치 않은 오류가 발생했습니다.\n잠시 후에 다시 이용해 주세요.');
        }
        $('#signInDiv').removeClass('hidden');
        $('#authLoadDiv').addClass('hidden');
    });
}

function signCheck(txt1, txt2) {
    if (txt1 != '' && txt2 != '') {
        return true;
    } else {
        return false;
    }
}

//0: 게스트
//1: 학생
//2: 선생님
//3: 자주 훼손되는 문서
//5: 교편위
//21: 전곽위키 부관리자
//101: 전곽위키 관리자
//3: 자주 훼손되는 문서
//5: 특별한 사람
//10: 교편위
//15: 교편위보다도 특별한 사람
//20: 부관리자?
//100: 관리자

//정보 불러오기
const userRef = firebase.database().ref('USER');
const rankRef = firebase.database().ref('RANK');
var userLevel = 0;
var userGisu = -1;
var userName = '실명';
var userNick = '별명';
var userEdit = 0;
var userWarn = 0;

auth.onAuthStateChanged(function (user) {

    console.log('로그인 중');
    if (user) {
        checkLevel().then(function () {

            console.log('로그인 됨');
            $("#signInDiv").addClass('hidden');
            $("#loginDiv").addClass('hidden');
            $('#authDiv').removeClass('hidden');
            $("#loginDiv").addClass('hidden');

        });
    } else {
        //로그아웃
        userLevel = 0;
        $('#authDiv').addClass('hidden');
        $("#signInDiv").removeClass('hidden');
        $("#loginDiv").removeClass('hidden');
        $('#authLoadDiv').addClass('hidden');

    }
});

// 로그아웃
function signOut() {

    if (confirm('로그아웃 하시겠습니까?')) {

        auth.signOut();
        reasonOfMove = '로그아웃';
        history.go(0);

    }
}

function checkLevel() {
    return new Promise(resolve => {

        var title = $('#titleH1').text();
        if (title.search(':') != -1) {
            checkCol(title.split(':')[0], title.split(':')[1]);
        } else {
            checkCol('', title);
        }

        var user = jshsus.auth().currentUser;
        if (user == null) {
            userLevel = 0;
            resolve(userLevel);
        } else {
            var email = user.email.split('.').join('%');
            jshsusUser.child('EMAIL').child(email).once('value', function (snapshot) {
                //console.log(snapshot.val());
                userGisu = snapshot.val().gisu;
                userName = snapshot.val().name;

                jshsusUser.child(userGisu).child(encodeURI(userName)).once('value', function (val) {
                    var jshsInfo = val.val();
                    userNick = jshsInfo.nick;


                    userRef.child(userGisu).child(userName).once('value', function (val2) {
                        rankRef.child(userName + '(' + userGisu + '기)').child('edit').once('value', function (val3) {



                            //console.log(val2.val());
                            if (val2.val() == null) {
                                userLevel = Number(jshsInfo.level.split(',')[0]) + 1;

                                if (userLevel == 2) {
                                    //선생님
                                    userLevel = 7;
                                }

                                userRef.child(userGisu).child(userName).set({
                                    level: userLevel,
                                    warn: 0,
                                }).then(() => {
                                    rankRef.child(userName + '(' + userGisu + '기)').set({
                                        edit: 0
                                    }).then(() => {
                                        if (userGisu == 0 || userGisu == '0') {
                                            $('#nickP').html(userNick + '(선생님)');
                                        } else {
                                            if (userLevel >= 15) {
                                                $('#nickP').html('<span class="adminNameSpan"><b>' + userNick + '</b>(' + userGisu + '기)' + '</span>' + '<bn>' + '<span style="font-size:1.7rem">' + ' 기여도:' + val3.val() + '</span>');
                                            } else if (userLevel >= 10) {
                                                $('#nickP').html('<span style="color:rgb(50, 100, 255)"><b>' + userNick + '</b>(' + userGisu + '기)' + '</span>' + '<bn>' + '<span style="font-size:1.7rem">' + ' 기여도:' + val3.val() + '</span>');
                                            } else if (userLevel >= 7) {
                                                $('#nickP').html('<span style="color:rgb(105, 201, 192)"><b>' + userNick + '</b>(' + userGisu + '기)' + '</span>' + '<bn>' + '<span style="font-size:1.7rem">' + ' 기여도:' + val3.val() + '</span>');
                                            } else {
                                                $('#nickP').html(userNick + '(' + userGisu + '기)' + '<bn>' + '<span style="font-size:1.7rem">' + ' 기여도:' + val3.val() + '</span>');
                                            }
                                        }
                                        resolve(userLevel);
                                    });
                                });

                            } else {
                                var userInfo = val2.val();
                                userWarn = userInfo.warn;
                                userLevel = userInfo.level;

                                if (userWarn >= 2) {

                                    alert('이 계정은 차단되었습니다.');
                                    auth.signOut();
                                    history.go(0);

                                } else {

                                    rankRef.child(userName + '(' + userGisu + '기)').once('value', function (data) {
                                        userEdit = data.val().edit;
                                        if (userGisu == 0 || userGisu == '0') {
                                            $('#nickP').html(userNick + '(선생님)');
                                        } else {
                                            if (userLevel >= 15) {
                                                $('#nickP').html('<span class="adminNameSpan"><b>' + userNick + '</b>(' + userGisu + '기)' + '</span>' + '<br>' + '<span style="font-size:1.7rem">' + ' 기여도:' + val3.val() + '</span>');
                                            } else if (userLevel >= 10) {
                                                $('#nickP').html('<span style="color:rgb(50, 100, 255)"><b>' + userNick + '</b>(' + userGisu + '기)' + '</span>' + '<bn>' + '<span style="font-size:1.7rem">' + ' 기여도:' + val3.val() + '</span>');
                                            } else if (userLevel >= 7) {
                                                $('#nickP').html('<span style="color:rgb(105, 201, 192)"><b>' + userNick + '</b>(' + userGisu + '기)' + '</span>' + '<bn>' + '<span style="font-size:1.7rem">' + ' 기여도:' + val3.val() + '</span>');
                                            } else {
                                                $('#nickP').html(userNick + '(' + userGisu + '기)' + '<bn>' + '<span style="font-size:1.7rem">' + ' 기여도:' + val3.val() + '</span>');
                                            }
                                        }
                                        resolve(userLevel);
                                    });
                                }
                            }
                        });
                    });
                });
            });
        }
    })
}



//문서와 관련된 작업//문서와 관련된 작업//문서와 관련된 작업//문서와 관련된 작업//문서와 관련된 작업//문서와 관련된 작업

const fstore = firebase.firestore();
const wikiDoc = fstore.collection('document');
var wikiCol;
var his = 0;
var txt;
var serial = 0;
//문서 등급
var level = 1;
//문서 생성 등급
var makeLevel = 1;

//어떤 종류의 문서인지 체크
function checkCol(col, doc) {

    if (col == '전곽위키') {
        //console.log('it is wiki');
        wikiCol = wikiDoc.doc('wiki');
        makeLevel = 15;
    } else if (col == '파일') {
        //console.log('it is file');
        wikiCol = wikiDoc.doc('file');
        makeLevel = 1;
    } else if (doc.search(/\([1-9]*기\)/) != -1) {
        //console.log('it is student');
        wikiCol = wikiDoc.doc('user');
        makeLevel = 7;
    } else if (doc.search('(선생님)') != -1) {
        //console.log('it is ssam');
        wikiCol = wikiDoc.doc('ssam');
        makeLevel = 7;
    } else if (col == '분류') {
        //console.log('it is class');
        wikiCol = wikiDoc.doc('class');
        makeLevel = 100;
    } else if (col == '틀') {
        //console.log('it is frame');
        wikiCol = wikiDoc.doc('frame');
        makeLevel = 1;
    } else {
        //console.log('it is document');
        wikiCol = wikiDoc.doc('doc');
        makeLevel = 1;
    }
}

//위키 문서 불러오기//위키 문서 불러오기//위키 문서 불러오기//위키 문서 불러오기//위키 문서 불러오기//위키 문서 불러오기
//num = 0 읽기 num = 1 편집
var status;
//숨김 문서 확인
var docPrivate = false;
var onlyDocName = '';
var onlyColName = '';
var fullName = '';
function loadDoc(colName, docName, num, realName) {


    status = num;
    fullName = realName;
    onlyDocName = docName;
    onlyColName = colName;
    checkCol(colName, docName);

    // console.log("colName => " + colName);
    // console.log("docName => " + onlyDocName);
    // console.log('title => ' + realName);

}

function realLoad(colName, num, realName, sharp) {

    //alert('0.6');
    wikiCol.collection(realName).orderBy('history', 'desc').limit(1).get({ source: 'server' }).then(field => {
        //console.log('loading');
        //alert('0.8');

        firebase.database().ref('SERIAL').once('value', function (happySerial) {
            serialNote = happySerial.val();
            if (field.empty) {

                //console.log("empty");
                if (num == 0) {
                    //읽기//읽기//읽기//읽기//읽기//읽기//읽기//읽기//읽기//읽기//읽기//읽기

                    $('#document').html('아직 존재하지 않는 문서입니다.');
                    loading(false);
                } else if (num == 1) {

                    //편집//편집//편집//편집//편집//편집//편집//편집//편집//편집//편집//편집//편집//편집

                    $('#document').text('새로운 문서를 편집합니다.');
                    $('#historyNumP').text('1번째 편집');
                    loading(false);
                }

            } else {
                txt = field.docs[0].data().content;
                his = field.docs[0].data().history;
                level = field.docs[0].data().level;

                if (field.docs[0].data().private != undefined) {
                    docPrivate = field.docs[0].data().private;
                }

                //console.log(txt);

                if (docPrivate) {

                    $('#document').html('이 문서는 숨김 처리된 문서입니다.\n열람 및 편집을 금합니다.');
                    loading(false);

                } else {

                    //console.log('-----------');
                    if (num == 0) {
                        //읽기//읽기//읽기//읽기//읽기//읽기//읽기//읽기//읽기//읽기//읽기//읽기

                        var url = decodeURI(document.URL.split("/").pop());

                        if (txt.search(/(?<!\\)\[넘겨주기\(.+?\)\]/) != -1 && url.search(/\?re/) == -1) {

                            var redirectDocName = txt.match(/(?<!\\)\[넘겨주기\((.+?)\)\]/)[1];

                            location.href = redirectDocName.replace(/ /gi, "%20") + '?re=' + url;

                        } else {

                            //틀 찾아서 넣는 함수
                            function showFrame(frameNameList, frameMatchNum, frameLoopNum, txt) {
                                return new Promise((resolve, reject) => {
                                    if (frameMatchNum == frameLoopNum) {
                                        resolve(txt);
                                    } else {
                                        wikiDoc.doc('frame').collection('틀:' + frameNameList[frameLoopNum]).orderBy('history', 'desc').limit(1).get({ source: 'server' }).then(value => {
                                            //console.log(value);
                                            if (value.empty) {
                                                console.log('틀:' + frameNameList[frameLoopNum] + ' 문서가 존재하지 않습니다.');
                                                txt = txt.replace(/(?<!\\)\[틀\((.+?)\)\](?:<br>)?/, "");
                                                //console.log(txt);
                                                showFrame(frameNameList, frameMatchNum, frameLoopNum + 1, txt).then(text => {
                                                    resolve(text);
                                                });
                                            } else if (value.docs[0].data().private) {
                                                console.log('틀:' + frameNameList[frameLoopNum] + ' 문서가 숨김 처리되어 있습니다.');
                                                txt = txt.replace(/(?<!\\)\[틀\((.+?)\)\](?:<br>)?/, "");
                                                //console.log(txt);
                                                showFrame(frameNameList, frameMatchNum, frameLoopNum + 1, txt).then(text => {
                                                    resolve(text);
                                                });
                                            } else {
                                                //console.log(txt);
                                                txt = txt.replace(/(?<!\\)\[틀\((.+?)\)\](?:<br>)?/, "<div class='frameDiv' id='틀:$1'>" + value.docs[0].data().content.split('<hr/>')[1] + "<\/div>");
                                                //console.log(txt);
                                                showFrame(frameNameList, frameMatchNum, frameLoopNum + 1, txt).then(text => {
                                                    resolve(text);
                                                });
                                            }
                                        });
                                    }
                                });
                            }

                            var frameMatchNum = (txt.match(/(?<!\\)\[틀\((.+?)\)\]/g) || []).length;

                            var frameNameList = [];

                            txt.replace(/(?<!\\)\[틀\((.+?)\)\]/g, function (match, capture) {
                                frameNameList.push(capture);
                                return match;
                            });

                            showFrame(frameNameList, frameMatchNum, 0, txt).then(text => {

                                //문법 적용 취소
                                txt = text.replace(/\\\[틀\((.+?)\)\]/g, '[틀($1)]');
                                txt = txt.replace(/\\\[넘겨주기\((.+?)\)\]/g, '[넘겨주기($1)]');

                                $('#document').html(txt);

                                if (colName != '분류') {

                                    var match;
                                    var indexTxt = "<div id='index' class='whiteBlock'>";
                                    var cnt = $("h2[id^=index_]").length;
                                    if ($("h2[id=index_1_]").html() != undefined) {
                                        for (var i = 1; i <= cnt; i++) {
                                            match = $("h2[id=index_" + i + "_]").html().split(/<a href="#index">.+?<\/a>/)[1];
                                            indexTxt = indexTxt.concat("<a href='#index_" + i + "_'>" + i + ".</a>" + match + "<br>");
                                            //console.log(indexTxt);
                                            var ccnt = $("h3[id^=index_" + i + "]").length;
                                            for (var j = 1; j <= ccnt; j++) {
                                                match = $("h3[id=index_" + i + "_" + j + "_]").html().split(/<a href="#index">.+?<\/a>/)[1];
                                                indexTxt = indexTxt.concat("&nbsp&nbsp<a href='#index_" + i + "_" + j + "_'>" + i + "." + j + ".</a>" + match + "<br>");
                                                //console.log(indexTxt);
                                                var cccnt = $("h4[id^=index_" + i + "_" + j + "]").length;
                                                for (var k = 1; k <= cccnt; k++) {
                                                    match = $("h4[id=index_" + i + "_" + j + "_" + k + "_]").html().split(/<a href="#index">.+?<\/a>/)[1];
                                                    indexTxt = indexTxt.concat("&nbsp&nbsp&nbsp&nbsp<a href='#index_" + i + "_" + j + "_" + k + "_'>" + i + "." + j + "." + k + ".</a>" + match + "<br>");
                                                    //console.log(indexTxt);
                                                    var ccccnt = $("h5[id^=index_" + i + "_" + j + "_" + k + "]").length;
                                                    for (var l = 1; l <= ccccnt; l++) {
                                                        match = $("h5[id=index_" + i + "_" + j + "_" + k + "_" + l + "_]").html().split(/<a href="#index">.+?<\/a>/)[1];
                                                        indexTxt = indexTxt.concat("&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<a href='#index_" + i + "_" + j + "_" + k + "_" + l + "_'>" + i + "." + j + "." + k + "." + l + ".</a>" + match + "<br>");
                                                        //console.log(indexTxt);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    //추천 문서 띄우기

                                    var relation;
                                    firebase.database().ref('RELATIONSHIP').once('value', function (snap) {
                                        relation = snap.val()
                                        var tag = relation[serialize(realName.replace(/\./g, '&DOT&'))]
                                        if (relation[serialize(realName.replace(/\./g, '&DOT&'))] == undefined) {
                                            $('aside[class^=container]').append('<div id="suyeon146" class="whiteBlock container asideDiv">' + '<p>추천 문서 없음</p>' + '<hr>' + '<div class= "container"><p>글을 한번 편집해 주세요.</p></div>' + '</div>')
                                        } else {
                                            $('aside[class^=container]').append('<div id="suyeon146" class="whiteBlock container asideDiv">' + '<p>추천 문서</p>' + '<hr></div>')
                                            var arr = new Array();
                                            for (tititle in tag) {
                                                if (tag[tititle]['std_fdp'] == undefined) {
                                                    tag[tititle]['std_fdp'] = 0;
                                                }
                                                var tt = tag[tititle]['tot_fdp'] + tag[tititle]['std_fdp']
                                                arr.push([tititle, tt])

                                            };
                                            arr.sort(function (a, b) {
                                                return a[1] - b[1];
                                            });
                                            arr.reverse();
                                            console.log(arr);
                                            for (i = 0; i < arr.length; i++) {
                                                if (inv_serialize(arr[i][0]) != undefined) {
                                                    $('div[id=suyeon146]').append('<div class="container">' + '<a href="' + inv_serialize(arr[i][0]) + '">' + inv_serialize(arr[i][0]) + '</a></div>' + '<hr>');
                                                };
                                            };
                                        }


                                    });

                                    var indexList = indexTxt.split('<br>');
                                    var trash = indexList.pop();

                                    var newTxt = txt.split('<hr/>');
                                    newTxt[2] = newTxt[1] + '<hr/>' + newTxt[2];
                                    newTxt[1] = indexList.join('<br>') + '</div>';
                                    newTxt[1] = newTxt[1] + newTxt[2];
                                    trash = newTxt.pop();

                                    $('#document').html(newTxt.join('<hr/>'));

                                    $('article[class^=whiteBlock]').append('<div id="learning"><p>이 문서와 가장 관련있다고 생각하는 문서 1개의 제목을 아래에 입력해 주세요. 여러분의 많은 참여가 전곽위키를 발전시킵니다.</p><input id="lrn" type="text" name="title"><input type="button" onclick="learning_function()" value="확인"></div>')

                                    $("a[id^=note]").each(function (index) {
                                        var note = $(this).attr("name");
                                        console.log(note);
                                        if (note.search(/<blockquote/g) != -1) {

                                            $(this).append('<div class="noteDiv container" style="min-width:max-content; justyficontent:center;"><a href="#foot_' + (index + 1) + '">[' + (index + 1) + ']</a><p>' + note + '</div>');

                                        } else {

                                            $(this).append('<div class="noteDiv container"><a href="#foot_' + (index + 1) + '">[' + (index + 1) + ']</a><p>' + note + '</p></div>');
                                        }
                                    });
                                }
                                //console.log(sharp);
                                if (sharp != undefined) {
                                    window.location.replace(fullName + '#' + sharp);
                                }

                                //넘겨받은 뒤 표시
                                if (url.search(/\?re=/) != -1) {
                                    $('#document').prepend('<p id="redirectAlertP"><a href="' + question.split('re=')[1] + '?re">'
                                        + question.split('re=')[1] + '</a> 에서 넘어옴</p>');
                                }

                                loading(false);
                            });
                        }

                    } else if (num == 1) {
                        console.log(colName);
                        //편집//편집//편집//편집//편집//편집//편집//편집//편집//편집//편집//편집//편집//편집
                        if (colName != '분류') {
                            //alert('1 => ' + load);
                            //alert(txt);
                            grammar(txt, 0);
                            //alert('2 => ' + load);
                            $('#historyNumP').text((his + 1) + '번째 편집');
                            //alert('3 => ' + load);
                            loading(false);
                            //alert('4 => ' + load);
                        } else {
                            //분류 문서면 분류 부분만 보여주기
                            var classTxt = txt.split('<hr/>')[0];
                            realClassContent = txt.split('<hr/>')[1];
                            //console.log(realClassContent);

                            classTxt = classTxt.replace(/<a title='(.+?)' href='.+?'>(.+?)<\/a>/g, function (match, first, second) {
                                return "[[" + first + "|" + second + "]]";
                            });

                            classGrammar(classTxt, 0).then((text) => {
                                $('#historyNumP').text((his + 1) + '번째 편집 | 상위분류만 적어주세요.');
                                text = text.replace(/<br>/g, "\n");
                                $("#document").text(text);
                                loading(false);
                            });
                        }
                    }
                }
            }
        });
    });
}
// 학습버튼


var relations;
firebase.database().ref('RELATIONSHIP').once('value', function (happyRelation) {
    relations = happyRelation.val();
});

//학습버튼 함수
function learning_function() {
    var targetle = $('#lrn').val();
    console.log(targetle);
    if (serialize(targetle.replace(/\./g, '&DOT&')) != undefined) {
        if (targetle == fullName) {
            alert("이 문서는 추천할 수 없습니다.")
        } else {
            var titleSerial = serialize(targetle.replace(/\./g, '&DOT&'));
            if (relations[serialize(fullName.replace(/\./g, '&DOT&'))][titleSerial] != undefined) {
                if (relations[serialize(fullName.replace(/\./g, '&DOT&'))][titleSerial]['std_fdp'] == undefined) {
                    var saveed_std = 0
                } else {
                    var saveed_std = relations[serialize(fullName.replace(/\./g, '&DOT&'))][titleSerial]['std_fdp'];
                }
                if (relations[serialize(fullName.replace(/\./g, '&DOT&'))][titleSerial]['tot_fdp'] != undefined) {
                    firebase.database().ref('RELATIONSHIP').child(serialize(fullName.replace(/\./g, '&DOT&'))).child(titleSerial).update({ std_fdp: (saveed_std + 0.4) }).then(() => {
                        console.log("done");
                        $("div[id=learning]").remove();
                        alert("참여해 주셔서 감사합니다.")
                    });
                } else {
                    eval("firebase.database().ref('RELATIONSHIP').child(" + serialize(fullName.replace(/\./g, '&DOT&')) + ").update({" + titleSerial + ": { tot_fdp: 0, std_fdp: (saveed_std + 0.4) } })").then(() => {
                        console.log("done");
                        $("div[id=learning]").remove();
                        alert("참여해 주셔서 감사합니다.")
                    });
                }
            } else {
                eval("firebase.database().ref('RELATIONSHIP').child(" + serialize(fullName.replace(/\./g, '&DOT&')) + ").update({" + titleSerial + ": { tot_fdp: 0, std_fdp: 0.4 } })").then(() => {
                    console.log("done");
                    $("div[id=learning]").remove();
                    alert("참여해 주셔서 감사합니다.")
                });
            }
        }

    } else {
        alert("존재하지 않는 문서입니다.")
    }




}

var realClassContent;

//위키 문서 저장하기//위키 문서 저장하기//위키 문서 저장하기//위키 문서 저장하기//위키 문서 저장하기//위키 문서 저장하기
var byte = 0;
function saveDoc(content) {

    var realName = $("#titleH1").text();
    var colName = realName.split(':');
    var docName = colName.pop();
    checkCol(colName, docName);

    //console.log(realName);
    var comment = prompt("기록해야 될 사항이 있다면 작성해주세요.\n없는 경우 확인을 눌러주세요.");

    if (comment == 'dltmxjdprm2') {
        comment = '';
        alert('Easter Egg 2');
    }

    if (his == 0) {

        $.post('../src/php/allDoc.php', { title: realName.replace(/ /g, '%20') }).then(function () {



            firebase.database().ref('VALUE').child('docCnt').once('value', function (snap) {

                var docCnt = snap.val();
                firebase.database().ref('VALUE').update({
                    docCnt: docCnt + 1
                }).then(() => {

                    firebase.database().ref('SERIAL').child(realName).set(docCnt).then(() => {

                        serialNote[realName] = docCnt;
                        saveFunction(content, realName, his, makeLevel, wikiCol, comment).then(function () {

                            wikiDoc.doc('all').update({

                                all: firebase.firestore.FieldValue.arrayUnion(realName)

                            }).then(function () {
                                rankRef.child(userName + '(' + userGisu + '기)').update({
                                    edit: userEdit + 3
                                }).then(() => {
                                    if (userEdit + 3 == userLevel * userLevel * 10
                                        || userEdit + 3 == userLevel * userLevel * 10 + 1
                                        || userEdit + 3 == userLevel * userLevel * 10 + 2
                                        && userLevel < 10) {
                                        userRef.child(userGisu).child(userName).child('level').set(userLevel + 1).then(() => {
                                            if (userLevel < 7) {
                                                alert('기여도를 ' + (userEdit + 3) + '만큼 쌓으셨네요.\n권한 등급이 ' + (userLevel + 1) + '(으)로 올랐습니다.');
                                                window.location.replace('../w/' + realName);
                                            } else if (userLevel == 7) {
                                                alert('기여도를 ' + (userEdit + 3) + '만큼 쌓으셨네요.\n권한 등급이 7로 올랐습니다.\n이제 "학생 문서"와 "선생님 문서"가 편집이 가능합니다.\n또한, 편집 시 역사의 별명이 연두색이 됩니다.');
                                                window.location.replace('../w/' + realName);
                                            } else if (userLevel < 9) {
                                                alert('기여도를 ' + (userEdit + 3) + '만큼 쌓으셨네요.\n권한 등급이 ' + (userLevel + 1) + '(으)로 올랐습니다.');
                                                window.location.replace('../w/' + realName);
                                            } else if (userLevel == 9) {
                                                alert('기여도를 ' + (userEdit + 3) + '만큼 쌓으셨네요.\n권한 등급이 최대(10)가 되었습니다.\n이제 편집 시 역사의 별명이 푸른색이 됩니다.');
                                                window.location.replace('../w/' + realName);
                                            }
                                        });
                                    } else {
                                        reasonOfMove = '편집';
                                        window.location.replace('../w/' + realName);
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    } else {

        saveFunction(content, realName, his, level, wikiCol, comment).then(function () {
            rankRef.child(userName + '(' + userGisu + '기)').update({
                edit: userEdit + 1
            }).then(() => {
                if (userEdit + 1 == userLevel * userLevel * 10 && userLevel < 10) {
                    userRef.child(userGisu).child(userName).child('level').set(userLevel + 1).then(() => {
                        if (userLevel < 7) {
                            alert('기여도를 ' + (userEdit + 1) + '만큼 쌓으셨네요.\n권한 등급이 ' + (userLevel + 1) + '(으)로 올랐습니다.');
                            window.location.replace('../w/' + realName);
                        } else if (userLevel == 7) {
                            alert('기여도를 ' + (userEdit + 1) + '만큼 쌓으셨네요.\n권한 등급이 7로 올랐습니다.\n이제 "학생 문서"와 "선생님 문서"가 편집이 가능합니다.\n또한, 편집 시 역사의 별명이 연두색이 됩니다.');
                            window.location.replace('../w/' + realName);
                        } else if (userLevel < 9) {
                            alert('기여도를 ' + (userEdit + 1) + '만큼 쌓으셨네요.\n권한 등급이 ' + (userLevel + 1) + '(으)로 올랐습니다.');
                            window.location.replace('../w/' + realName);
                        } else if (userLevel == 9) {
                            alert('기여도를 ' + (userEdit + 1) + '만큼 쌓으셨네요.\n권한 등급이 최대(10)가 되었습니다.\n이제 편집 시 역사의 별명이 푸른색이 됩니다.');
                            window.location.replace('../w/' + realName);
                        }
                    });
                } else {
                    reasonOfMove = '편집';
                    window.location.replace('../w/' + realName);
                }
            });
        });
    }
}

//검색엔쥔
function searchMaker() {
    var relship;
    firebase.database().ref('RELATIONSHIP').once('value', function (snap) {
        relship = snap.val();
    }).then(() => {
        var searchedTxt;
        if ($("#searchTxt").val() != "") {
            var searchedTxt = $("#searchTxt").val();
        } else {
            alert("검색어를 입력해 주세요.")
            return;
        }//검색어 받아옴
        var keywordObject = new Object();//키워드 리스트 받아올 거
        var searchedObject = new Object();
        firebase.database().ref('KEYWORD').once('value', function (snap) {
            keywordObject = snap.val()
            for (key in keywordObject) {
                var temptkey = key;
                for (key in keywordObject[temptkey]) {
                    if (key == searchedTxt) {
                        searchedObject[temptkey] = keywordObject[temptkey][key]
                    }

                }
            }
        }).then(() => {
            console.log(searchedObject)//{문서의 시리얼: 검색어를 가지고 있는 개수, 시리얼: 개수, .....} 요렇게 나오면 됨
            var totalList = new Set();//검색된 문서와 연관된 문서(검색어를 포함하든 안하든)를 다 모음 중복 없이
            var addedList = new Set();//검색어가 없는 문서지만 연관된 문서 즉 새롭게 추가될 문서들을 모음
            for (key in searchedObject) {
                var temp = key;
                totalList.add(String(temp));

                for (key in relship[temp]) {
                    totalList.add(String(key))
                    if (searchedObject[key] == undefined) {
                        addedList.add(String(key))

                    }
                }
            }
            var addedRealList = [...addedList].sort(); // addedList를 Set그대로 쓰려니 오류가 생겨서 List로 바꿔줌
            var totalRealList = [...totalList].sort(); // 얘도 위와 같은 이유
            for (var i = 0; i < addedRealList.length; i++) {

                searchedObject[addedRealList[i]] = 0.3
            }
            var relList = new Array(totalRealList.length); // nXn 인접행렬 생성
            for (var i = 0; i < relList.length; i++) {
                relList[i] = new Array(totalRealList.length);
            }
            console.log("ready!!")
            for (var i = 0; i < totalRealList.length; i++) {
                for (var j = 0; j < totalRealList.length; j++) {
                    if (i == j) {
                        relList[i][j] = 0
                    } else {
                        if (relship[totalRealList[i]] == undefined) {
                            relList[i][j] = 0
                        } else {
                            if (relship[totalRealList[i]][totalRealList[j]] == undefined) {
                                relList[i][j] = 0
                            } else {
                                relList[i][j] = ((relship[totalRealList[i]][totalRealList[j]]["tot_fdp"] + relship[totalRealList[i]][totalRealList[j]]["std_fdp"]) * (1 - 1.2 ** (-searchedObject[totalRealList[j]] * searchedObject[totalRealList[i]])))
                            }
                        }
                    }
                }
            }
            console.log(relList)//인접행렬 만듬
        })
    });
}






var serialNote;
var friendList;

//앞으로 쓸 씨리얼 함수
function serialize(title) {
    return serialNote[title];
}
//씨리얼 역함수
function inv_serialize(serial) {
    for (key in serialNote) {
        if (serialNote[key] == serial) {
            return key;
        }
    }
}

//관련도 만들기 함수
function friendMaker(content, docName) {
    return new Promise(function (resolve) {
        //씨리얼 목록 파일 받아옴

        console.log(serialNote[docName]);
        //친구 목록 불러옴. 저장하는 과정에서 실행. 앞에서 title과 content 변수를 가져왔을거라 예상. docName은 저장하는 문서의 제목이다

        firebase.database().ref('RELATIONSHIP').child(serialize(docName)).once('value', function (snap) {
            friendList = snap.val();

            var saved_std_fdp = (friendList || []);


            console.log(1);
            var list_update = [];
            content.replace(/<a title='(.+?)'/g, function (match, targettitle) {
                if (serialize(targettitle) != undefined) {
                    list_update.push(serialize(targettitle));
                }
            });//content의 docName을 시리얼로 받아 list_update에 추가
            console.log(1);
            var finalUpdate = [];
            function listcountmaker() {
                for (p = 0; p < list_update.length; p++) {
                    eval("cnt_" + list_update[p] + "=" + "0");
                };
            }
            listcountmaker();//(cnt+list_update[p])을 전역변수로 선언
            console.log(1);
            var p = list_update.length;
            while (p != 0) {
                eval("cnt_" + list_update[p - 1] + "+=" + "1");
                if (-1 == finalUpdate.indexOf(list_update[p - 1])) {
                    finalUpdate.push(list_update[p - 1])
                }
                var k = list_update.pop(p - 1);
                p = list_update.length
            }

            finalUpdate.sort();
            console.log(finalUpdate);
            console.log(saved_std_fdp);
            var finalObject = new Object();

            for (i = 0; i < finalUpdate.length; i++) {
                eval("var relative" + "=" + "5*(1-0.8**(cnt_" + finalUpdate[i] + "));");
                if (saved_std_fdp[finalUpdate[i]] == undefined) {
                    finalObject[finalUpdate[i]] = { tot_fdp: relative, std_fdp: 0 };
                } else {
                    if (saved_std_fdp[finalUpdate[i]]['std_fdp'] == undefined) {
                        finalObject[finalUpdate[i]] = { tot_fdp: relative, std_fdp: 0 };
                    } else {
                        finalObject[finalUpdate[i]] = { tot_fdp: relative, std_fdp: saved_std_fdp[finalUpdate[i]]['std_fdp'] }
                    }
                }


                //console.log(finalObject)

            }
            firebase.database().ref('RELATIONSHIP').child(serialize(docName)).set(null).then(() => {
                firebase.database().ref('RELATIONSHIP').child(serialize(docName)).set(finalObject).then(() => {
                    console.log("done");
                    resolve();
                });
            });


        });
    });
}

function saveFunction(CONTENT, TITLE, HISTORY, LEVEL, REF, COMMENT) {

    return new Promise(function (success, fail) {
        var BYTE = getByteLength(CONTENT);
        //console.log(CONTENT);
        //console.log(TITLE);
        //console.log(HISTORY);
        //console.log(LEVEL);
        //console.log(BYTE);
        //console.log(REF.path);




        var hisName = userNick + '(' + userGisu + '기)';

        if (userName + '(' + userGisu + '기)' == fullName) {
            hisName = '<span style="color:rgb(249, 166, 2)"><b>본인</b></span>';
        } else if (userLevel >= 15) {
            hisName = '<span class="adminNameSpan"><b>' + userNick + '</b>(' + userGisu + '기)' + '</span>';
        } else if (userLevel >= 10) {
            hisName = '<span style="color:rgb(50, 100, 255)"><b>' + userNick + '</b>(' + userGisu + '기)' + '</span>';
        } else if (userLevel >= 7) {
            hisName = '<span style="color:rgb(105, 201, 192)"><b>' + userNick + '</b>(' + userGisu + '기)' + '</span>';
        }
        var t = new Date();

        friendMaker(CONTENT, TITLE).then(() => {
            REF.collection(TITLE).doc(String(-1000000 + (HISTORY + 1))).set({
                content: CONTENT,
                nick: hisName,
                name: userName + '(' + userGisu + '기)',
                level: LEVEL,
                byte: BYTE,
                history: HISTORY + 1,
                time: t.getTime(),
                comment: COMMENT,
                private: false,
            }).then(function () {

                if (REF.id != 'class' && REF.id != 'file') {
                    logRef.child(TITLE).set({
                        name: TITLE,
                        time: t.getTime()
                    }).catch(err => {
                        console.log(err);
                    }).then(() => {
                        success();
                        // loadLog({ source: 'server' }).then(() => {
                        //     success();
                        // });
                    })
                } else {
                    success();
                }
            });
        });
    });
}

//문서 삭제하기//문서 삭제하기//문서 삭제하기//문서 삭제하기//문서 삭제하기//문서 삭제하기//문서 삭제하기//문서 삭제하기
function deleteDoc(colName, docName, realName) {
    return new Promise(resolve => {
        //console.log(realName + '의 log delete complete!');

        firebase.database().ref('SERIAL').child(realName.replace(/\./g, '&DOT&')).set(null).then(() => {
            console.log('시리얼에서 삭제 완료');
            deleteAllDoc(realName).then(function () {
                //console.log(realName + '의 allDoc delete complete!');
                //문서 없애기 (컬렉션)
                //oldClassList 얻기


                if (colName != '분류') {
                    checkCol(colName, docName);
                    wikiCol.collection(realName).orderBy('history', 'desc').limit(1).get({ source: 'server' }).then(snapshot => {

                        console.log('삭제 진행 중인 문서 이름 => ' + realName);

                        var content = snapshot.docs[0].data().content.split(/<\/hr>/g)[0];
                        content = content.replace(/<a title='(.+?)' href='.+?'>(.+?)<\/a>/g, function (match, first, second) {
                            if (first != second) {
                                return "[[" + first + "|" + second + "]]";
                            }
                        });
                        var oldClass = new Array();
                        content = content.split('<hr/>')[0];
                        content = content.replace(/(?<!\\)(?:&nbsp)?\|?(?:&nbsp)?\[\[.+?\|(.+?)]](?!])/g, function (match, val) {
                            oldClass.push(val);
                            return '[#' + val + '#]<br>';
                        });
                        //console.log(realName + '의 내용 => '+content);
                        //console.log(realName + '의 oldClass');
                        console.log(realName + '의 상위 분류');
                        console.log(oldClass);

                        deleteDocClass(realName, oldClass, 0).then(() => {
                            checkCol(colName, docName);
                            //console.log(realName + '의 class delete complete!');
                            wikiCol.collection(realName).get().then(val => {

                                deleteDocuments(0, val.docs, realName).then(() => {
                                    if (colName != '파일') {
                                        deleteLog(realName).then(function () {
                                            console.log(realName + ' 완전히 제거 성공');
                                            resolve();
                                        });
                                    } else {
                                        console.log(realName + ' 완전히 제거 성공');
                                        resolve();
                                    }
                                });
                            });
                        });
                    });
                } else {
                    checkCol(colName, docName);
                    //console.log(realName + '의 class delete complete!');
                    wikiCol.collection(realName).get().then(val => {
                        deleteDocuments(0, val.docs, realName).then(() => {
                            console.log(realName + ' 완전히 제거 성공');
                            resolve();
                        });
                    });
                }
            });
        });
    });
}



//로그에서 지우기
function deleteLog(realName) {
    return new Promise(resolve => {
        logRef.child(realName).remove().then(function () {
            resolve();
        });
    });
}

//allDoc에서 지우기
function deleteAllDoc(realName) {
    return new Promise(resolve => {
        //txt파일에서 지우고
        $.post('../src/php/delete.php', { num: 1, docName: realName.replace(/ /g, '%20') }).then(function () {
            //fireStore에서 지우기
            wikiDoc.doc('all').update({
                all: firebase.firestore.FieldValue.arrayRemove(realName)
            }).then(() => {
                resolve();
            });
        });
    });
}

//분류에서 지우기
function deleteDocClass(docName, list, k) {
    return new Promise(resolve => {

        if (k < list.length) {
            console.log('분류:' + list[k] + '에서 ' + docName + ' 제거 시작');
            classFunction('분류:' + list[k], 1, docName).then(() => {
                deleteDocClass(docName, list, k + 1).then(() => {
                    resolve();
                });

            });
        } else {
            resolve();
        }
    });
}

//문서 하나하나 없애기
function deleteDocuments(num, docs, realName) {
    return new Promise(resolve => {
        //console.log('length => '+docs.length);
        //console.log('colName => '+colName);
        if (docs.length > num) {
            wikiCol.collection(realName).doc(docs[num].id).delete().then(() => {
                deleteDocuments(num + 1, docs, realName).then(() => {
                    resolve();
                })
            });
        } else {
            //파일 문서의 경우 파일도 삭제!
            if (realName.split(':')[0] != realName.split(':')[1] && realName.split(':')[0] == '파일') {
                fstorage.child('img/' + realName.split(':')[1]).delete().then(() => {
                    resolve();
                });
            } else {
                resolve();
            }
        }
    });
}

const logRef = firebase.database().ref('LOG');

//수정된 문서//수정된 문서//수정된 문서//수정된 문서//수정된 문서//수정된 문서//수정된 문서//수정된 문서//수정된 문서//수정된 문서
function loadLog(setting) {
    return new Promise(resolve => {

        // var filter = "win16|win32|win64|mac|macintel";
        // if (navigator.platform) {
        //     if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
        //         //모바일
        //         alert('mobile');
        //     } else {
        //         //pc
        //         console.log('pc');
        //     }
        // }


        var logs = new Array;

        //wikiDoc.doc('log').collection('log').orderBy('time', 'desc').limit(1).get({source: 'server'}).then(logs => {
        logRef.orderByChild('time').limitToLast(10).once('value', function (snap) {
            snap.forEach(function (logData) {
                logs.push(logData.val());
                //console.log(logData.val());
            });
            logs.reverse();
            logs.forEach(function (log) {
                var dt = new Date(log.time);
                $('#logDiv').append('<div class="container"><a href="' + log.name + '">'
                    + log.name + '</a><p>' + dt.getHours() + ':' + dt.getMinutes() + '</p></div><hr>');
            })

            resolve();

            // if (!logs.empty) {
            //     wikiDoc.doc('log').collection('log').orderBy('time', 'desc').where('time', '>=', logs.docs[0].data().time + 200000).limit(1).get({ source: 'server' }).then(nowLog => {

            //         //console.log(logs.docs[0].data());
            //         if (!nowLog.empty) {
            //             //console.log('new log');

            //             loadLog({ source: 'server' }).then(() => {
            //                 resolve();
            //             });

            //         } else {
            //             //console.log('old log');

            //             logs.forEach(function (logData) {
            //                 log.push(logData.data());
            //             });
            //             //console.log(logs);
            //             for (var i = 1; i < 11; i++) {
            //                 var dt = new Date(log[i - 1].time);
            //                 $('#logDiv').append('<div class="container"><a href="' + log[i - 1].doc + '">' + log[i - 1].doc + '</a><p>' + dt.getHours() + ':' + dt.getMinutes() + '</p></div><hr>');
            //             }

            //             resolve();
            //         }



            //     });
            // } else {
            //     //console.log('new log');

            //     loadLog({ source: 'server' }).then(() => {
            //         resolve();
            //     });
            // }
        });
    });
}

//기여도 순위
function loadRank() {
    rankRef.orderByChild('edit').limitToLast(7).once('value', function (data) {
        var editCount = new Array();
        var editName = new Array();
        data.forEach(function (val) {
            editName.push(val.key);
            editCount.push(val.val().edit);
        });
        //console.log(editName);
        for (var i = editName.length - 1; i > -1; i--) {
            $('#rankDiv').append('<div class="container"><p>' + editName[i] + ' : ' + editCount[i] + '</p></div><hr>');
        }
    });
}

//파일 업로드 파일 업로드 파일 업로드 파일 업로드 파일 업로드 파일 업로드 파일 업로드 파일 업로드 파일 업로드

const fstorage = firebase.storage().ref();
var storageRef;
var fileData = undefined;

function changeFile(files) {
    fileData = files[0];
    console.log(fileData);
    $('#uploadDiv > label').text(fileData.name);
}

function uploadFile() {

    if (fileData != undefined) {

        if ($('#uploadInput').is(':checked')) {

            $('#uploadInput').prop('checked', false);

            if (confirm(fileData.name + "파일을 업로드 하시겠습니까?")) {

                loading(true);
                var fileName = fileData.name;

                var isNew = true;

                classRef.child('파일').child('file').once('value').then(function (val) {
                    for (var key in val.val()) {
                        console.log(key);
                        if (key.replace(/&DOT&/g, '.') == fileName) {
                            isNew = false;
                        }
                    }

                    if (!isNew) {

                        alert('이름이 같은 파일이 존재합니다.');
                        history.go(0);
                        loading(false);

                    } else {

                        fstorage.child('img/' + fileName).put(fileData).then(function () {
                            var thisByte = getByteLength("[{" + fileName + "}]\nsize:" + fileData.size);
                            $.post('../src/php/allDoc.php', { title: ('파일:' + fileName).replace(/ /g, '%20') }).then(function () {
                                wikiDoc.doc('all').update({

                                    all: firebase.firestore.FieldValue.arrayUnion('파일:' + fileName)

                                }).then(function () {

                                    fstorage.child('img/' + fileName).getDownloadURL().then(fileUrl => {
                                        classFunction('분류:파일', 0, "파일:" + fileName).then(function () {

                                            saveFunction("분류:&nbsp<a title='분류:파일' href='분류:파일'>파일<\/a><hr/><img onclick='window.location.replace(`파일:" + fileName + "`);' style='cursor:pointer; width:100%;' alt='파일이 존재하지 않습니다.' name='" + fileName + "' src='" + fileUrl + "'><br>size:" + fileData.size + '<hr/>', '파일:' + fileName, 0, 1, wikiDoc.doc('file'), '');
                                            alert(fileName + ' 파일이 정상적으로 업로드 되었습니다.');
                                            $("#uploadDiv").hide();
                                            loading(false);
                                            history.go(0);
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            } else {
                alert('다른 파일을 선택하려면 새로고침 하세요.');
            }
        }
    }
}

const classRef = firebase.database().ref('CLASS');
//className은 분류:이름 으로 받았음.
//docName은 추가해야 할 문서 이름으로 풀네임임.
//0은 doc이 추가되는 경우, 1은 doc이 제거되는 경우
function classFunction(className, number, docName) {
    return new Promise(resolve => {
        var onlyClassName = className.split(':').pop();
        //console.log(docName);
        var onlyDocName = docName.split(':').pop().replace(/\./g, '&DOT&');
        //console.log(onlyDocName);
        var parsedOnlyDocName = onlyDocName.replace(/ /g, '%20');
        classRef.child(onlyClassName).once('value', function (snap) {
            var highClass = undefined;
            var lowClass = undefined;
            var classDoc = undefined;
            var classWiki = undefined;
            var classFile = undefined;
            var classFrame = undefined;

            var classHistory = 0;

            var classDocList = [];
            var classWikiList = [];
            var classFileList = [];
            var classFrameList = [];
            var highClassList = [];
            var lowClassList = [];

            if (snap.val() != null) {
                highClass = snap.val().high;
                lowClass = snap.val().low;
                classDoc = snap.val().doc;
                classWiki = snap.val().wiki;
                classFile = snap.val().file;
                classFrame = snap.val().frame;
                classHistory = snap.val().history;
            }

            if (highClass != undefined && highClass != '') {
                for (var key in highClass) {
                    highClassList.push(key);
                }
            }

            if (lowClass != undefined && lowClass != '') {
                for (var key in lowClass) {
                    lowClassList.push(key);
                }
            }

            if (classDoc != undefined && classDoc != '') {
                for (var key in classDoc) {
                    classDocList.push(key);
                }
            }

            if (classWiki != undefined && classWiki != '') {
                for (var key in classWiki) {
                    classWikiList.push(key);
                }
            }

            if (classFile != undefined && classFile != '') {
                for (var key in classFile) {
                    classFileList.push(key);
                }
            }

            if (classFrame != undefined && classFrame != '') {
                for (var key in classFrame) {
                    classFrameList.push(key);
                }
            }


            // console.log(highClassList);
            // console.log (lowClassList);
            // console.log (classDocList);
            // console.log(classWikiList);
            // console.log(classFileList);

            if (number == 0) {
                //추가되는 경우
                var isNew = false;
                if (classDocList.length == 0 && classWikiList.length == 0 && classFileList.length == 0
                    && lowClassList.length == 0 && classFrameList.length == 0) {
                    //새로운 분류
                    isNew = true;
                } else {
                    //보존되는 분류
                    isNew = false;
                }

                if (docName.search(/분류:/g) != -1) {
                    //하위 분류 문서
                    lowClassList.push(parsedOnlyDocName);
                    changeClassData('low', onlyClassName, onlyDocName, 0);

                } else if (docName.search(/전곽위키:/g) != -1) {
                    //위키 문서
                    classWikiList.push(parsedOnlyDocName);
                    changeClassData('wiki', onlyClassName, onlyDocName, 0);

                } else if (docName.search(/파일:/g) != -1) {
                    //파일 문서
                    classFileList.push(parsedOnlyDocName);
                    changeClassData('file', onlyClassName, onlyDocName, 0);

                } else if (docName.search(/틀:/g) != -1) {
                    //틀 문서
                    classFrameList.push(parsedOnlyDocName);
                    changeClassData('frame', onlyClassName, onlyDocName, 0);

                } else {
                    //일반 문서
                    classDocList.push(parsedOnlyDocName);
                    changeClassData('doc', onlyClassName, onlyDocName, 0);
                }

                if (isNew) {
                    //새로운 분류
                    highClassList[0] = '미분류';
                    makeClassContents(highClassList, lowClassList, classWikiList, classFileList, classFrameList, classDocList, className).then(content => {
                        //문서 이름 목록에 추가(서버 텍스트 파일)
                        $.post('../src/php/allDoc.php', { title: className.replace(/ /g, '%20') }).then(function () {

                            firebase.database().ref('VALUE').child('docCnt').once('value', function (snap) {
                                var serialNum = snap.val();

                                firebase.database().ref('SERIAL').child(className).set(serialNum).then(() => {

                                    console.log(serialNum);

                                    firebase.database().ref('VALUE').child('docCnt').set(serialNum + 1).then(() => {

                                        //분류 문서 새로 생성
                                        saveFunction(content, className, 0, 1, wikiDoc.doc('class'), '').then(function () {
                                            //문서 이름 목록에 추가2 (데이터베이스)
                                            wikiDoc.doc('all').update({

                                                all: firebase.firestore.FieldValue.arrayUnion(className)

                                            }).then(function () {
                                                classRef.child(onlyClassName).child('history').set(1).then(() => {
                                                    classRef.child(onlyClassName).child('high').child('미분류').set(true).then(() => {
                                                        classFunction('분류:미분류', 0, className).then(() => {
                                                            console.log(className + ' 생성 완료');
                                                            resolve();
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                } else {
                    //보존되는 분류
                    makeClassContents(highClassList, lowClassList, classWikiList, classFileList, classFrameList, classDocList, className).then(content => {
                        //바뀐 분류 문서 저장
                        saveFunction(content, className, classHistory - 1, 1, wikiDoc.doc('class'), '').then(function () {
                            console.log(className + ' 변경 완료');
                            resolve();

                        });
                    });
                }

            } else if (number == 1) {
                //제거되는 경우
                if (docName.search(/분류:/g) != -1) {
                    //하위 분류 문서
                    lowClassList.splice(lowClassList.indexOf(parsedOnlyDocName), 1);
                    changeClassData('low', onlyClassName, onlyDocName, 1);


                } else if (docName.search(/전곽위키:/g) != -1) {
                    //위키 문서
                    classWikiList.splice(classWikiList.indexOf(parsedOnlyDocName), 1);
                    changeClassData('wiki', onlyClassName, onlyDocName, 1);

                } else if (docName.search(/파일:/g) != -1) {
                    //파일 문서
                    classFileList.splice(classFileList.indexOf(parsedOnlyDocName), 1);
                    changeClassData('file', onlyClassName, onlyDocName, 1);

                } else if (docName.search(/틀:/g) != -1) {
                    //틀 문서
                    classFrameList.splice(classFrameList.indexOf(parsedOnlyDocName), 1);
                    changeClassData('frame', onlyClassName, onlyDocName, 1);

                } else {
                    //일반 문서
                    classDocList.splice(classDocList.indexOf(parsedOnlyDocName), 1);
                    changeClassData('doc', onlyClassName, onlyDocName, 1);
                }

                console.log(className + '에서 ' + docName + '이 삭제되는 중');
                console.log(highClassList);

                if (classDocList.length == 0 && classWikiList.length == 0 && classFileList.length == 0
                    && lowClassList.length == 0 && classFrameList.length == 0) {
                    //삭제되는 분류

                    console.log(className + '이 하위 문서 및 분류가 없어 삭제되는 중');
                    //상위분류 데이터에서 이 분류 제거하기
                    function removeFromHighClass(num, highClass, thisName) {
                        return new Promise(resolve => {
                            if ((highClass || []).length <= num) {
                                resolve();
                            } else {
                                console.log('분류:' + highClass[num] + '에서 ' + thisName + ' 제거 시작');
                                classFunction('분류:' + highClass[num], 1, thisName).then(() => {
                                    removeFromHighClass(num + 1, highClass, thisName).then(() => {
                                        resolve();
                                    });
                                });
                            }
                        });
                    }



                    //상위분류에서 이 분류 제거하기
                    removeFromHighClass(0, highClassList, className).then(() => {
                        //이 분류 문서 제거하기
                        classRef.child(onlyClassName).remove().then(() => {
                            deleteDoc('분류', onlyClassName, className).then(() => {
                                //console.log(className + ' 제거 완료');
                                resolve();
                            });
                        });
                    });

                } else {
                    //보존되는 분류
                    makeClassContents(highClassList, lowClassList, classWikiList, classFileList, classFrameList, classDocList, className).then(content => {
                        //바뀐 분류 문서 저장
                        saveFunction(content, className, classHistory - 1, 1, wikiDoc.doc('class'), '').then(function () {
                            console.log(className + ' 변경 완료');
                            resolve();

                        });
                    });
                }
            } else {
                console.log('Error with classFunction number!');
            }
        });
    });
}

//분류이름 / 문서      이름 / 0은 추가 1은 삭제
function changeClassData(docType, className, docName, num) {
    return new Promise(resolve => {

        if (num == 0) {
            classRef.child(className).child(docType).child(docName).set(true).then(() => {
                resolve();
            });
        } else if (num == 1) {
            classRef.child(className).child(docType).child(docName).set(null).then(() => {
                resolve();
            });

        }
    });
}

function makeClassContents(highClassList, lowClassList, classWikiList, classFileList, classFrameList, classDocList, className) {

    return new Promise(resolve => {

        //모두 합친 결과.
        var allClassContent = '';
        //분류된 문서 관련 내용
        var classDocContent = '';
        //전곽위키 문서가 분류된 경우 내용
        var classWikiContent = '';
        //파일 문서가 분류된 경우 내용
        var classFileContent = '';
        //틀 문서가 분류된 경우 내용
        var classFrameContent = '';
        //하위 문서 내용
        var lowClassContent = '';
        //상위 문서 내용
        var highClassContent = '';

        lowClassContent = '<h2>하위분류</h2>';
        classDocContent = '<h2>"' + className.split(':').pop() + '"(으)로 분류된 문서</h2>';
        classWikiContent = '<h2>"' + className.split(':').pop() + '"(으)로 분류된 전곽위키</h2>';
        classFileContent = '<h2>"' + className.split(':').pop() + '"(으)로 분류된 파일</h2>';
        classFrameContent = '<h2>"' + className.split(':').pop() + '"(으)로 분류된 틀</h2>';

        if (lowClassList.length != 0) {
            lowClassList.sort();
            for (var i = 0; i < lowClassList.length; i++) {
                lowClassList[i] = lowClassList[i].replace(/&DOT&/g, '.');
            }
            lowClassContent = classCho(lowClassList, '분류:', lowClassContent);
        } else {
            lowClassContent = '';
        }

        if (classDocList.length != 0) {
            classDocList.sort();
            for (var i = 0; i < classDocList.length; i++) {
                classDocList[i] = classDocList[i].replace(/&DOT&/g, '.');
            }
            classDocContent = classCho(classDocList, '', classDocContent);
        } else {
            classDocContent = '';
        }

        if (classWikiList.length != 0) {
            classWikiList.sort();
            for (var i = 0; i < classWikiList.length; i++) {
                classWikiList[i] = classWikiList[i].replace(/&DOT&/g, '.');
            }
            classWikiContent = classCho(classWikiList, '전곽위키:', classWikiContent);
        } else {
            classWikiContent = '';
        }

        if (classFileList.length != 0) {
            classFileList.sort();
            for (var i = 0; i < classFileList.length; i++) {
                classFileList[i] = classFileList[i].replace(/&DOT&/g, '.');
            }
            classFileContent = classCho(classFileList, '파일:', classFileContent);
        } else {
            classFileContent = '';
        }

        if (classFrameList.length != 0) {
            classFrameList.sort();
            for (var i = 0; i < classFrameList.length; i++) {
                classFrameList[i] = classFrameList[i].replace(/&DOT&/g, '.');
            }
            classFrameContent = classCho(classFrameList, '틀:', classFrameContent);
        } else {
            classFrameContent = '';
        }

        if (highClassList.length != 0) {
            highClassList.sort();
            for (var i = 0; i < highClassList.length; i++) {
                highClassList[i] = highClassList[i].replace(/&DOT&/g, '.');
            }
            highClassContent = '[#' + highClassList.join('#][#') + '#]';
        } else {
            highClassContent = '';
        }


        //console.log(allClassContent);

        function makeHighClassContent(highClassContent) {
            return new Promise(resolve => {
                var classNum = 0;
                var lastNum = (highClassContent.match(/(?<!\\)\[#(.+?)#](?!])(?:\n)?/g) || []).length;
                highClassContent = highClassContent.replace(/(?<!\\)\[#(.+?)#](?!])(?:\n)?/g, function (match, content) {
                    classNum += 1;

                    if (classNum == 1 && lastNum == 1) {
                        return "&nbsp<a title='분류:" + content + "' href='분류:" + content + "'>" + content + "<\/a><hr/>";
                    } else if (classNum == 1) {
                        return "&nbsp<a title='분류:" + content + "' href='분류:" + content + "'>" + content + "<\/a>";
                    } else {
                        if (classNum == lastNum) {
                            return "&nbsp|&nbsp<a title='분류:" + content + "' href='분류:" + content + "'>" + content + "<\/a><hr/>";
                        } else {
                            return "&nbsp|&nbsp<a title='분류:" + content + "' href='분류:" + content + "'>" + content + "<\/a>";
                        }
                    }
                });

                if (highClassContent == '') {
                    resolve('<hr/>' + highClassContent);
                } else {
                    resolve('분류:' + highClassContent);
                }
            });
        }

        makeHighClassContent(highClassContent).then(text => {
            allClassContent = text + lowClassContent + classDocContent + classWikiContent
                + classFileContent + classFrameContent + '<hr/>';
            //console.log('allClassContent => ' + allClassContent);

            unListGrammar(allClassContent, 1).then(finalClassContent => {
                //console.log('finalClassContent => ' + finalClassContent);
                resolve(finalClassContent.replace(/%20/g, ' '));
            });
        });
    });
}


function classCho(docList, doctype, content) {
    var notSortedList = [];
    var sortedList = [];

    for (var i = 0; i < docList.length; i++) {
        sortedList.push(docList[i].toUpperCase());
        notSortedList.push(docList[i].toUpperCase());
    }

    sortedList.sort();

    var matchNum = 0;
    var nowNum = -1;
    var choList = ['기타', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    //var gitaList = ['.', ',', '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '|', '<', '>', '?', ':', '{', '}', '[', ']'];
    for (var i = 0; i < sortedList.length; i++) {

        if (sortedList[i].charAt(0).search(/[0-9]/) != -1) {
            matchNum = choList.indexOf(sortedList[i].charAt(0));
            //console.log('it is Number => ' + choList[matchNum] + ':' + matchNum);
        } else if (sortedList[i].charAt(0).search(/[가-힣]/) != -1) {
            matchNum = Math.floor(((sortedList[i].charCodeAt(0) - 44032) / 28) / 21) + 37;
            //console.log('it is Korean => ' + choList[matchNum] + ':' + matchNum);
        } else if (sortedList[i].charAt(0).search(/[A-Z]/) != -1) {
            matchNum = choList.indexOf(sortedList[i].charAt(0));
            //console.log('it is English => ' + choList[matchNum] + ':' + matchNum);
        } else {
            matchNum = 0;
            //console.log('it is Nothing => ' + choList[matchNum] + ':' + matchNum);
        }

        if (matchNum > nowNum) {
            if (nowNum == -1) {
                content = content.concat('<h4 style="margin: 1rem auto">' + choList[matchNum] + '</h4>:');
            } else {
                content = content.concat(':<h4 style="margin: 1rem auto">' + choList[matchNum] + '</h4>:');
            }
            nowNum = matchNum;
        }

        var realDocName = docList[notSortedList.indexOf(sortedList[i])];
        if (i == docList.length - 1) {
            content = content.concat("(<a title='" + doctype + realDocName + "' href='" + doctype + realDocName + "'>" + realDocName + "</a>):");
            return content;
        } else {
            content = content.concat("(<a title='" + doctype + realDocName + "' href='" + doctype + realDocName + "'>" + realDocName + "</a>\n)");
        }
    }
}

//분류 저장 방식 변경하면서 쓴 함수
function addClassData() {
    var docList = new Array();
    if ((className = prompt('분류 이름')) != undefined) {
        if ((classDocType = prompt('분류된 문서 종류 (doc, wiki, file, high, low)')) != undefined) {
            if ((docList = prompt('문서 리스트 (공백 구분)').split(' ')) != undefined) {
                docList.forEach(function (value, index) {
                    console.log(value);
                    value = value.replace(/%20/g, ' ');
                    value = value.replace(/\./g, '&DOT&');
                    classRef.child(className).child(classDocType).child(value).set(true);
                });
            }
        }
    }
}