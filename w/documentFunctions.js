$("#editBtn").click(function () {
    if (docPrivate) {
        alert('숨김 처리된 문서입니다.');
    } else {
        if (level == 7) {

            alert('학생 문서보다는 학술적인 문서를 만들어야 하지 않을까요??\n당분간 학생 문서는 편집이 불가합니다.');

        } else {
            checkLevel().then(() => {
                if (userLevel == 0) {
                    alert('로그인 후 문서를 편집 및 생성할 수 있습니다.');

                } else if (userName + '(' + userGisu + '기)' == fullName) {

                    alert('본인의 문서입니다. 편집이 가능합니다.');

                } else if (userLevel < makeLevel && his == 0) {

                    alert('권한이 부족하여 문서를 생성할 수 없습니다.');

                } else if (userLevel < level && his != 0) {

                    alert('권한이 부족하여 문서를 편집할 수 없습니다.');

                } else if (onlyColName == '분류' && his == 0) {

                    alert('분류 문서는 직접적으로 생성할 수 없습니다.');

                }
                location.href = "../e/" + $("#titleH1").text().replace(/ /gi, "%20");
            });
        }
    }
});


$("#historyBtn").click(function () {

    if (!docPrivate) {
        if ($('#showHistoryDiv').css('display') == 'none') {

            addHistory();


        } else {

            $('#checkHistoryDiv').slideToggle();
            $("#showHistoryDiv").slideToggle();
        }
    } else {
        alert('숨김 처리된 문서입니다.');
    }

});

var isClicked = false;
$('#optionBtn').off('click').on('click', function () {

    if (!isClicked) {
        isClicked = true;

        checkLevel().then(() => {


            if (his == 0) {
                alert('아직 존재하지 않는 문서입니다.');
                isClicked = false;

            } else if (docPrivate && userName + '(' + userGisu + '기)' == fullName) {

                var answer = prompt('본인의 숨김 처리된 문서입니다.\n본인의 문서가 다시 작성되는 것을 승인하고 싶다면 "승인"을 입력해 주세요.');

                if (answer == '승인') {
                    wikiCol.collection(fullName).doc(String(-1000000 + (his))).update({
                        private: false
                    }).then(() => {
                        alert('문서가 숨김 해제되었습니다.\n이제 다시 문서를 편집하거나 열람할 수 있습니다.\n다시 문서를 편집할 수 없게 하고 싶다면 설정에서 "거부"를 입력해주세요.');
                        isClicked = false;
                    });
                } else {
                    isClicked = false;
                }


            } else if (userName + '(' + userGisu + '기)' == fullName) {

                var answer = prompt('본인의 문서입니다.\n본인의 문서가 작성되는 것을 거부하고 싶다면 "거부"를 입력해 주세요.');

                if (answer == '거부') {
                    wikiCol.collection(fullName).doc(String(-1000000 + (his))).update({
                        private: true
                    }).then(() => {
                        alert('문서가 숨김 처리되었습니다.\n더 이상 문서를 편집하거나 열람할 수 없습니다.\n다시 문서를 편집할 수 있게 하고 싶다면 설정에서 "승인"을 입력해주세요.');
                        isClicked = false;
                    });
                } else {
                    isClicked = false;
                }

            } else if (userLevel < level || userLevel < 20) {
                alert('권한이 부족합니다.');
                isClicked = false;

            } else {

                var num1 = prompt('1. 문서등급 재설정 (현재 등급: ' + level + ')\n2. 문서 숨김\n3. 문서 숨김 해제\n4. 문서 삭제');

                // if(num1 == null || num1 == '') {
                //     isClicked = false;
                // }

                if (num1 == 1) {
                    var num2 = prompt('등급을 몇으로 설정하시겠습니까?\n1 => 일반회원\n5 => 특별회원\n10 => 교지편집위원회\n15 => 관리회원\n20 => 부관리자\n100 => 관리자');

                    if (num2 > 0 && num2 <= userLevel) {
                        level = num2;
                        wikiCol.collection($('#titleH1').text()).doc(String(his - 1000000)).update({
                            level: level
                        }).then(() => {
                            alert('문서의 등급이 변경되었습니다.');
                            isClicked = false;
                        });
                    } else if (num2 > userLevel) {
                        alert('문서의 등급을 자신의 권한보다 높게 설정할 수 없습니다.');
                        isClicked = false;
                    } else {
                        alert('1부터 자신의 권한 사이의 숫자를 입력해 주세요.');
                        isClicked = false;
                    }
                } else if (num1 == 2) {

                    wikiCol.collection(fullName).doc(String(-1000000 + (his))).update({
                        private: true
                    }).then(() => {
                        alert('문서가 숨김 처리되었습니다.\n더 이상 문서를 편집하거나 열람할 수 없습니다.');
                    });

                } else if (num1 == 3) {

                    wikiCol.collection(fullName).doc(String(-1000000 + (his))).update({
                        private: false
                    }).then(() => {
                        alert('문서가 숨김 해제되었습니다.\n이제 다시 문서를 편집하거나 열람할 수 있습니다.');
                    });

                } else if (num1 == 4) {

                    if (userLevel >= 20) {
                        if (onlyColName == '분류') {

                            alert('분류 문서는 강제로 삭제할 수 없습니다.');
                            isClicked = false;

                        } else {

                            if (confirm("문서를 삭제하시겠습니까?")) {

                                loading(true);
                                deleteDoc(onlyColName, onlyDocName, fullName).then(() => {
                                    loading(false);
                                    $("#loginDiv").addClass('hidden');
                                    alert(fullName + '의 제거가 완료되었습니다.');
                                });
                            }
                        }
                    } else {
                        alert('권한이 부족합니다.');
                        isClicked = false;
                    }
                } else {
                    isClicked = false;
                }
            }
        });
    }
});

var historyContent = new Array();
//var commentList = new Array();
var isHistoryLoaded = false;

function addHistory() {
    if (!isHistoryLoaded) {
        wikiCol.collection(fullName).limit(10).get({ source: 'server' }).then(field => {
            //console.log(field);
            if (field.empty) {
                $('#checkHistoryDiv').text('아직 만들어지지 않은 문서입니다.');
            } else {
                var byteList = new Array();


                if (his <= 9) {
                    byteList[0] = 0;
                }
                $('#checkHistoryDiv').text('');

                var reverseField = field.docs.reverse();
                reverseField.forEach(data => {
                    byteList[data.data().history] = data.data().byte;
                    //commentList[data.data().history] = data.data().comment;
                    historyContent[data.data().history] = data.data().content;

                    var byteGap = byteList[data.data().history] - byteList[data.data().history - 1];
                    var ts = new Date(data.data().time);

                    if (his < 10) {
                        addHistoryTxt(data.data().history, byteGap, data.data().nick, ts, data.data().comment);
                    } else {
                        if (data.data().history > his - 9) {
                            addHistoryTxt(data.data().history, byteGap, data.data().nick, ts, data.data().comment);
                        }
                    }
                });
                isHistoryLoaded = true;
                $("#checkHistoryDiv").slideToggle();
                $("#document").slideToggle();
            }
        });
    } else {
        $("#checkHistoryDiv").slideToggle();
        $("#document").slideToggle();
    }
}

function addHistoryTxt(history, gap, nick, time, comment) {
    if (comment == undefined || comment == '') {
        comment = '';
    } else {
        comment = '&#8594(' + comment + ')';
    }

    var gapColor = 'black';
    if (gap > 0) {
        gapColor = 'green';
    } else if (gap < 0) {
        gapColor = 'red';
    } else {
        gapColor = 'black';
    }

    $("#checkHistoryDiv").prepend('<div class="container historyTitleDiv"><span><a href="#" class="historyTitleA" id="h_' + history + '"><span>' + history + '</span>번째 수정판</a><span style="color: ' + gapColor + ';"> (' + gap + ')</span></span>'
        + '<span><span>' + nick + '</span> <span onclick="report(`' + fullName + '`, `' + history + '`);" style="color:red; cursor:pointer; font-size:1.5rem;">(신고)</span></span>'
        + '<span>' + time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + '</span></div>' + '<div style="color:grey; text-align:center; font-size:2rem;">' + comment + '</div>');
}

$(document).on('click', '.historyTitleA', function () {
    $('#oldHistoryTitleSpan').text($(this).attr('id').split('_')[1] - 1 + '번째 수정판');
    $('#newHistoryTitleSpan').text($(this).attr('id').split('_')[1] + '번째 수정판 (선택)');
    $('#oldVsNewTitleSpan').html('<span style="color: red;">' + ($(this).attr('id').split('_')[1] - 1) + '번째 수정판</span> VS <span style="color: limegreen;">' + $(this).attr('id').split('_')[1] + '번째 수정판</span>');


    if (onlyColName == '분류') {
        var oldClassTxt = '';
        if ($(this).attr('id').split('_')[1] - 1 != 0) {
            oldClassTxt = historyContent[$(this).attr('id').split('_')[1] - 1].split('<hr/>')[0];
        }
        var newClassTxt = historyContent[$(this).attr('id').split('_')[1]].split('<hr/>')[0];



        grammar(oldClassTxt + '<hr/><hr/>', 2).then(txt => {
            grammar(newClassTxt + '<hr/><hr/>', 2).then(txt2 => {
                compareHistory(txt, txt2);
            });
        });


    } else {
        if (historyContent[$(this).attr('id').split('_')[1] - 1] != undefined) {
            grammar(historyContent[$(this).attr('id').split('_')[1] - 1], 2).then(txt => {
                grammar(historyContent[$(this).attr('id').split('_')[1]], 2).then(txt2 => {
                    compareHistory(txt, txt2);
                });
            });
        } else {
            grammar(historyContent[$(this).attr('id').split('_')[1]], 2).then(txt2 => {
                compareHistory('', txt2);
            });
        }
    }

    $('#showHistoryP').html(historyContent[$(this).attr('id').split('_')[1]]);
    $("#checkHistoryDiv").slideToggle();
    $("#showHistoryDiv").slideToggle();

});

// 각주

$(document).on("click", "a[id^=note]", function (e) {
    var width = window.innerWidth || document.body.clientWidth;
    if (width <= 800) {
        //console.log(id);
        e.preventDefault();
        if ($(this).children('div').css('visibility') == 'hidden') {
            $('.noteDiv').css('visibility', 'hidden');
            $(this).children('div').css('visibility', 'visible');
        } else {
            $(this).children('div').css('visibility', 'hidden');
        }
    }
});

$(document).on("mouseenter", "a[id^=note]", function (event) {
    var width = window.innerWidth || document.body.clientWidth;
    if (event.clientX < (width / 2)) {
        $(this).children('div').css('left', 0);
        $(this).children('div').css('right', '');
    } else {
        $(this).children('div').css('right', 0);
        $(this).children('div').css('left', '');
    }
});

var isAdded = true;
//match가 제거되는 부분 //change가 추가되는 부분
function compareHistory(match, change) {
    //console.log(match);
    //console.log(change);
    var vsList = new Array();

    var matchList = [];
    var changeList = change.split('\n');
    if (match != '') {
        matchList = match.split('\n');
    }

    var which = 'match';

    var loopNum = matchList.length;
    if (matchList.length < changeList.length) {
        loopNum = changeList.length;
        which = 'change';
    }
    //console.log('loopNum => ' + loopNum);
    for (var i = 0; i < loopNum; i++) {
        //console.log('-----------i => ' + i + ', num => ' + (loopNum)+'--------------');
        // console.log("m--------=" + matchList[i] + "=---------");
        // console.log("c--------=" + changeList[i] + "=---------");
        if (matchList[i] != undefined && changeList[i] != undefined) {
            // console.log(changeList[i].indexOf(matchList[i]));
            // console.log(matchList[i].indexOf(changeList[i]));
            if (changeList[i] == matchList[i]) {
                //줄이 안 바뀜.
                vsList.push(matchList[i]);

                if (matchList[i] == '') {
                    matchList[i] = ' ';

                }
                if (changeList[i] == '') {
                    changeList[i] = ' ';
                }

            } else {
                //줄이 수정되거나 바뀜


                addCheck();

                function addCheck() {
                    isAdded = true;
                    //console.log(changeList[i]);
                    for (var k = i; k < matchList.length; k++) {

                        //오른쪽 i번째 줄과 같은 줄이 왼쪽에 나올 때까지 반복
                        if (matchList[k] == changeList[i]) {
                            //오른쪽 i번째 줄과 왼쪽 k번째 줄이 같음
                            //console.log('같은 줄 찾음! => ' + changeList[i]);
                            isAdded = false;
                            //왼쪽의 k번째 줄보다 위쪽 줄은 다 삭제된 줄이거나
                            //오른쪽 i+changeNum번째 줄이 추가된 줄인 것.
                            removeCheck(k);
                        } else {
                            //오른쪽 i번째 줄과 왼쪽 k번째 줄과 다름
                        }
                    }

                    if (isAdded) {
                        //오른쪽 i번째 줄과 같은 줄이 왼쪽에 없음.
                        //=> 오른쪽 i번째 줄은 추가된 것임.
                        //console.log(1);
                        addHistoryLine();
                        if (which == 'change') {
                            loopNum += 1;
                        }
                    } else {
                        //오른쪽 i번째 줄과 같은 줄이 왼쪽에 있음.
                    }
                }

                function removeCheck(n) {
                    //오른쪽 줄 기준 변수
                    var isAdd = false;
                    //왼쪽줄을 하나하나 처음부터 n번째까지 반복
                    for (var j = i; j < n; j++) {
                        //왼쪽 j번째 줄과 오른쪽 처음부터 끝줄과 비교해서 같은 것이 있는가?
                        for (var m = i; m < changeList.length; m++) {
                            if (changeList[m] == matchList[j] && matchList[j] != '' && matchList[j] != ']:'
                                && matchList[j] != '):' && matchList[j] != '}:') {
                                //왼쪽 j번째 줄과 같은 줄이 오른쪽에도 있다는 것.
                                isAdd = true;

                            }
                        }
                    }

                    if (isAdd) {
                        //왼쪽 처음부터 n번째 줄과 같은 줄이 오른쪽에도 '하나라도' 있다는 것.
                        //=> 왼쪽 처음부터 n번째 줄은 그대로
                        //=> 오른쪽 i+changeNum번째 줄이 추가된 것.
                        //console.log(2);
                        addHistoryLine();
                        if (which == 'change') {
                            loopNum += 1;
                        }

                    } else {
                        //왼쪽 처음부터 n번째 줄은 그냥 삭제된 줄이라는 것
                        //왼쪽줄을 하나하나 처음부터 n번째까지 반복
                        //console.log(3);
                        removeHistoryLine();
                        if (which == 'match') {
                            loopNum += 1;
                        }
                        // for (var j = i; j < n; j++) {


                        // }
                    }
                }
            }

        } else if (changeList[i] == undefined && matchList[i] == undefined) {
            //그냥 넘어가기
        } else if (changeList[i] == undefined) {
            //나머지 쭉 삭제된 줄
            //console.log('delete');
            removeHistoryLine();
        } else if (matchList[i] == undefined) {
            //나머지 쭉 추가된 줄
            //console.log('add');
            addHistoryLine();
        }
        if ((i + 1) == (loopNum)) {
            $("#oldHistoryDiv").html(matchList.join('<hr>'));
            $("#newHistoryDiv").html(changeList.join('<hr>'));
            $("#oldVsNewDiv").html(vsList.join('\n'));
        }
    }

    function addHistoryLine() {
        if (changeList[i] == '') {
            changeList[i] = ' ';
        }
        matchList.splice(i, 0, '<blockquote class="small" style="visibility: hidden;">' + changeList[i] + '</blockquote>');
        //console.log('추가된 줄 => ' + changeList[i]);
        changeList[i] = '<blockquote class="small" style="background-color: rgb(0, 255, 0, 0.3); color: DarkGreen;">' + changeList[i] + '</blockquote>';
        vsList.push(changeList[i]);

    }

    function removeHistoryLine() {
        if (matchList[i] == '') {
            matchList[i] = ' ';
        }
        changeList.splice(i, 0, '<blockquote class="small" style="visibility: hidden;">' + matchList[i] + '</blockquote>');
        //console.log('삭제된 줄 => ' + matchList[i]);
        matchList[i] = '<blockquote class="small" style="background-color: rgb(255,0,0, 0.3); color: maroon;">' + matchList[i] + '</blockquote>';
        vsList.push(matchList[i]);
    }
}

//신고
//문서 제목, 몇번째 판인지, 수정한 사람의 별명
const reportRef = firebase.database().ref('REPORT');
function report(docName, editHistory) {

    var reason = prompt('신고하신 이유가 무엇입니까? (신고는 익명으로 접수됩니다.)\n\n숫자를 입력해 주세요.\n1. 욕설 및 비방\n2. 허위 사실 유포\n3. 성의 없거나 불필요한 편집\n4. (학생, 선생님 문서의 경우)본인이 원하지 않는 편집\n5. 문서 훼손 또는 장난\n6. 저작권 침해\n7. 기타');

    if (reason != 1 && reason != 2 && reason != 3 && reason != 4 && reason != 5 && reason != 6 && reason != 7) {
        alert('신고를 취소합니다.');
    } else {
        var memo = '';
        if (reason == 2 || reason == 4 || reason == 6) {
            memo = prompt('자세한 내용을 입력해 주세요.');
        } else if (reason == 7) {
            memo = prompt('어떤 규칙을 위반하였는지 또는 어떤 이유로 신고하였는지 자세하게 적어주세요.');
        } else {
            memo = prompt('혹시 더 설명해야 할 부분이 있다면 입력해 주세요.');
        }

        if (reason == 1) {
            reason = '욕설 및 비방';
        } else if (reason == 2) {
            reason = '허위 사실 유포';
        } else if (reason == 3) {
            reason = '성의 없거나 불필요한 편집';
        } else if (reason == 4) {
            reason = '본인이 원하지 않는 편집';
        } else if (reason == 5) {
            reason = '문서 훼손 또는 장난';
        } else if (reason == 6) {
            reason = '저작권 침해';
        } else if (reason == 7) {
            reason = '기타적인 이유';
        }

        if (confirm(docName + '의 ' + editHistory + '번째 판을 수정한 사람을 ' + reason + '(으)로 신고하시겠습니까?\n(신고는 익명으로 접수됩니다.)')) {
            var nt = new Date();

            checkLevel().then(() => {
                reportRef.child(nt.getTime()).set({
                    reason: reason,
                    memo: memo,
                    docName: docName,
                    history: editHistory
                }).then(() => {
                    alert('신고가 접수되었습니다.');
                });
            });
        }
    }
}