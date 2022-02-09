var historyInfos = {};

function loadHistory(movePoint) {

    historyInfos = {};
    console.log(movePoint);

    $('#showHistoryDiv').addClass('hidden');
    $('#showHistoryP').addClass('hidden');
    $('#checkHistoryDiv').removeClass('hidden');

    if (serialize(movePoint.doc) == undefined) {

        $('#checkHistoryDiv').text('아직 존재하지 않는 문서입니다.');

    } else {

        firebase.firestore().collection(String(serialize(movePoint.doc))).orderBy('history', 'desc').limit(1).get({
            source: 'server'
        }).then(field => {
            if (field.docs[0].data().state == 1) {
                $('#checkHistoryDiv').text('숨김 처리되어 역사를 확인할 수 없습니다.');
            } else {

                let question = movePoint.question;
                if(question.search(/&/) != -1) {
                    if(question.split('&')[0] == 'doc=.') {
                        question = question.split('&').slice(1).join('&');
                    }
                }

                if (question.split('=')[0] == 'compare') {

                    console.log('compare');

                    let firstNum = Number(question.split('=')[1].split('&')[0]);
                    let secondNum = Number(question.split('=')[1].split('&')[1]);

                    if (isNaN(firstNum) || isNaN(secondNum)) {
                        //역사 번호가 잘못됨.
                        $("#checkHistoryDiv").text("역사 번호를 제대로 입력해 주세요.");
                    } else {

                        if (firstNum > secondNum) {
                            $('#oldHistoryTitleSpan').text(secondNum + '번째 수정판');
                            $('#newHistoryTitleSpan').text(firstNum + '번째 수정판 (선택)');
                            $('#oldVsNewTitleSpan').html('<span style="color: red;">' + secondNum + '번째 수정판</span> VS <span style="color: limegreen;">' + firstNum + '번째 수정판</span>');
                            compareHistory(secondNum, firstNum);
                        } else if (firstNum < secondNum) {
                            $('#oldHistoryTitleSpan').text(firstNum + '번째 수정판 (선택)');
                            $('#newHistoryTitleSpan').text(secondNum + '번째 수정판');
                            $('#oldVsNewTitleSpan').html('<span style="color: red;">' + firstNum + '번째 수정판</span> VS <span style="color: limegreen;">' + secondNum + '번째 수정판</span>');
                            compareHistory(firstNum, secondNum);
                        } else {
                            $("#checkHistoryDiv").text("같은 문서를 서로 비교할 수 없습니다.");
                        }

                    }

                } else if (question.split('=')[0] == 'show' && parseInt(question.split('=')[1]) != NaN) {

                    console.log('show');
                    $('#checkHistoryDiv').addClass('hidden');
                    $('#showHistoryP').removeClass('hidden');
                    showHistoryDoc(movePoint.doc, parseInt(question.split('=')[1])).then((content) => {})

                } else {

                    console.log('main');
                    firebase.database().ref('HISTORY').child(serialize(movePoint.doc)).limitToLast(11).once('value', field => {

                        historyInfos = field.val();

                        $('#checkHistoryDiv').empty();

                        for (k in historyInfos) {
                            addHistoryTxt(historyInfos[k]);
                        }

                        addAnchorEventListener();

                    });
                }
            }
        })
    }
}

function addHistoryTxt(historyInfo) {

    var time = new Date(historyInfo.time);
    var comment = historyInfo.comment;
    var gap = historyInfo.changedByte;
    var nick = historyInfo.editorNick;
    var history = historyInfo.history;

    if (comment != '') {
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

    $("#checkHistoryDiv").prepend('<div class="container historyTitleDiv"><span><a href="?show=' + history + '"><span>' + history + '</span>번째 수정판</a>(<a href="?compare=' + history + '&' + (history + 1) + '">최신</a>|<a href="?compare=' + history + '&' + (history - 1) + '">이전</a>)<span style="color: ' + gapColor + ';"> (' + gap + ')</span></span>' +
        '<span><span>' + nick + '</span> <span onclick="report(`' + docInfo.name + '`, `' + history + '`);" style="color:red; cursor:pointer; font-size:1.5rem;">(신고)</span></span>' +
        '<span>' + timeFormat(time) + '</span></div>' + '<div style="color:grey; text-align:center; font-size:2rem;">' + comment + '</div>');
}

function showHistoryDoc(docName, historyNum) {
    return new Promise((resolve, reject) => {

        //console.log(docName + ' | ' + historyNum);

        $('.historyNumP').text('(역사 열람 ' + historyNum + '번째 수정판)');

        firebase.firestore().collection(String(serialize(docName))).doc(String(historyNum)).get().then(snap => {

            docInfo = snap.data();

            docInfo.highClass = classListFormat(docInfo.highClass, 1);
            docInfo.lowClass = classListFormat(docInfo.lowClass, 1) || [];
            docInfo.lowDoc = classListFormat(docInfo.lowDoc, 3) || [];

            //console.log(docInfo);

            docInfo.name = inv_serialize(docInfo.serial);
            refreshDocInfo(docInfo.name);

            //서버에서 불러온 체계화된 정보를 하나의 텍스트로 바꾸는 과정임.
            docInfo.content = '';

            mainGrammar('load').then(() => {
                grammar('load').then(() => {
                    // console.log(docInfo.content);
                    makeIndexList().then(indexTxt => {

                        //console.log(indexTxt);

                        //console.log(docInfo.content);

                        if (indexTxt != '<div id="index" class="whiteBlock"></div>') {
                            docInfo.content = docInfo.content.split('<hr/>');
                            docInfo.content[1] = indexTxt + docInfo.content[1];
                            docInfo.content = docInfo.content.join('<hr/>');
                        }

                        $('#showHistoryP').html(docInfo.content);
                        window.scrollTo(0, 0);


                        moveToHash();
                        addNoteBubble();
                        addAnchorEventListener();
                        addParagraphBtn();
                        resolve();
                    });
                });
            });
        })


        // $('#oldHistoryTitleSpan').text(history1 + '번째 수정판');
        // $('#newHistoryTitleSpan').text(history2 + '번째 수정판 (선택)');
        // $('#oldVsNewTitleSpan').html('<span style="color: red;">' + ($(this).attr('id').split('_')[1] - 1) + '번째 수정판</span> VS <span style="color: limegreen;">' + $(this).attr('id').split('_')[1] + '번째 수정판</span>');
        // if (historyInfos[$(this).attr('id').split('_')[1] - 1] != undefined) {
        //     mainGrammar('edit', historyInfos[$(this).attr('id').split('_')[1] - 1]).then(info1 => {
        //         mainGrammar('edit', historyInfos[$(this).attr('id').split('_')[1]]).then(info2 => {
        //             compareHistory(info1.content, info2.content);
        //             mainGrammar('load', historyInfos[$(this).attr('id').split('_')[1]]).then(info => {

        //                 grammar('load', info).then(info2 => {
        //                     makeIndexList(info2).then(indexTxt => {

        //                         //console.log(indexTxt);

        //                         //console.log(docInfo.content);

        //                         if (indexTxt != '<div id="index" class="whiteBlock"></div>') {
        //                             info2.content = info2.content.split('<hr/>');
        //                             info2.content[1] = indexTxt + info2.content[1];
        //                             info2.content = info2.content.join('<hr/>');
        //                         }
        //                         $('#showHistoryP').html(info2.content);
        //                         addNoteBubble();
        //                         addAnchorEventListener();
        //                         addParagraphBtn();
        //                         MathJax.typeset();
        //                         $("#checkHistoryDiv").slideToggle();
        //                         $("#showHistoryDiv").slideToggle();
        //                     });
        //                 });
        //             });
        //         })
        //     })
        // } else {
        //     mainGrammar('edit', historyInfos[$(this).attr('id').split('_')[1]]).then(info => {
        //         compareHistory('', info.content);
        //         mainGrammar('load', historyInfos[$(this).attr('id').split('_')[1]]).then(info => {

        //             grammar('load', info).then(info2 => {
        //                 makeIndexList(info2).then(indexTxt => {

        //                     //console.log(indexTxt);

        //                     //console.log(docInfo.content);

        //                     if (indexTxt != '<div id="index" class="whiteBlock"></div>') {
        //                         info2.content = info2.content.split('<hr/>');
        //                         info2.content[1] = indexTxt + info2.content[1];
        //                         info2.content = info2.content.join('<hr/>');
        //                     }

        //                     $('#showHistoryP').html(info2.content);
        //                     addNoteBubble();
        //                     addAnchorEventListener();
        //                     addParagraphBtn();
        //                     MathJax.typeset();
        //                     $("#checkHistoryDiv").slideToggle();
        //                     $("#showHistoryDiv").slideToggle();
        //                 });
        //             });
        //         });
        //     });
        // }
    });
}

var isAdded = true;
//match가 제거되는 부분 //change가 추가되는 부분
function compareHistory(firstNum, secondNum) {

    let match = '';
    let change = '';

    firebase.firestore().collection(String(serialize(movePoint.doc))).doc(String(firstNum)).get().then(firstSnap => {
        if (!firstSnap.exists) {
            //어느 한 문서가 존재 x
            $("#checkHistoryDiv").text(firstNum + "번째 수정판이 존재하지 않습니다.");
        } else {
            firebase.firestore().collection(String(serialize(movePoint.doc))).doc(String(secondNum)).get().then(secondSnap => {
                if (!secondSnap.exists) {
                    //어느 한 문서가 존재 x
                    $("#checkHistoryDiv").text(secondNum + "번째 수정판이 존재하지 않습니다.");
                } else {

                    let firstSnapInfo = firstSnap.data();
                    firstSnapInfo.highClass = classListFormat(firstSnapInfo.highClass, 1);
                    firstSnapInfo.lowClass = classListFormat(firstSnapInfo.lowClass, 1) || [];
                    firstSnapInfo.lowDoc = classListFormat(firstSnapInfo.lowDoc, 3) || [];

                    let secondSnapInfo = secondSnap.data();
                    secondSnapInfo.highClass = classListFormat(secondSnapInfo.highClass, 1);
                    secondSnapInfo.lowClass = classListFormat(secondSnapInfo.lowClass, 1) || [];
                    secondSnapInfo.lowDoc = classListFormat(secondSnapInfo.lowDoc, 3) || [];

                    $('.historyNumP').text('(역사 비교 ' + firstNum + '&'+secondNum+'번째 수정판)');

                    $("#checkHistoryDiv").addClass('hidden');
                    $("#showHistoryDiv").removeClass('hidden');
                    mainGrammar('edit', firstSnapInfo).then(firstInfo => {
                        mainGrammar('edit', secondSnapInfo).then(secondInfo => {


                            match = firstInfo.content;
                            change = secondInfo.content;

                            // console.log(match);
                            // console.log(change);

                            var vsList = new Array();

                            var matchList = match.split('\n');
                            var changeList = change.split('\n');

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
                                                    if (changeList[m] == matchList[j] && matchList[j] != '' && matchList[j] != ']:' &&
                                                        matchList[j] != '):' && matchList[j] != '}:') {
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

                        })
                    })
                }
            })
        }
    })
}