function addBtnListener() {

  $(".historyBtn").off('click');
  $(".saveBtn").off('click');
  $('.grammarBtn').off('click');
  $(".exitBtn").off('click');
  $('.editBtn').off('click');
  $('.optionBtn').off('click');
  $('.linkBtn').off('click');
  $('.deleteBtn').off('click');
  $('.moveBtn').off('click');
  $('.documentBtn').off('click');
  $('.debateBtn').off('click');
  $(".titleH1").off('click');

  $(".deleteBtn").on('click', function () {
    let docName = getDocName();
    if (serialNote[docName] == undefined) {
      alert('아직 존재하지 않는 문서입니다!');
    } else {
      checkAcl(docName).then(() => {
        checkLevel().then(() => {
          if (aclInfo.delete > userInfo.level) {
            alert('권한이 부족합니다!');
          } else {
            refreshDocInfo(docName);

            if (docInfo.type == 'class') {
              alert('분류 문서는 강제로 삭제할 수 없습니다.');
            } else if (docInfo.type == 'user') {
              alert('사용자 문서는 강제로 삭제할 수 없습니다.');
            } else {

              if (confirm("문서를 삭제하시겠습니까?\n(파일 문서의 경우 파일도 함께 삭제됩니다.)\n*문서 내 링크는 모두 제거하여 한 번 저장한 뒤 문서를 삭제해 주세요.")) {

                deleteDoc(docInfo.type, docInfo.name).then(() => {
                  console.log(docName);
                  alert(docName + ' 문서의 삭제가 완료되었습니다.');
                  movePage('상상위키:대문', '', '', 'w');
                  loading(false);
                });
              } else {
                alert('삭제가 취소되었습니다.');
              }
            }
          }
        })
      })
    }
  })

  $(".moveBtn").on('click', function () {

    let docName = getDocName();

    if (serialNote[docName] == undefined) {
      alert('아직 존재하지 않는 문서입니다!');
    } else {
      checkAcl(docName).then(() => {
        checkLevel().then(() => {
          if (aclInfo.move > userInfo.level) {
            alert('권한이 부족합니다!');
          } else {
            if ((newDocName = prompt("새로운 문서 제목을 입력해 주세요.")) != (false || undefined)) {

              if (checkType(newDocName) == checkType(docName)) {

                if (checkType(newDocName) != 'file') {
                  $('#logP').text('문서를 이동하는 중');
                  loading(true);

                  moveDoc(docName, newDocName).then(() => {
                    alert(docName + '을(를) ' + newDocName + '(으)로 이동 완료했습니다.');
                    movePage(newDocName, '', '', 'w');
                    history.go(0);
                  });
                } else {
                  alert("파일 문서는 이동할 수 없습니다.")
                }
              } else {
                alert('부적절한 제목입니다!');
              }
            } else {
              alert('문서 이동이 취소되었습니다.');
            }
          }
        })
      })
    }
  })

  $(".debateBtn").on('click', function () {
    alert('개발중...');
  })

  $(".linkBtn").on('click', function () {
    alert('개발중...');
  })

  $(".titleH1").on('click', function () {
    let docName = getDocName();
    movePage(docName, '', '', 'w');
  })

  $(".documentBtn").on('click', function () {
    let docName = getDocName();
    movePage(docName, '', '', 'w');
  })

  $(".historyBtn").on('click', function () {
    let docName = getDocName();
    movePage(docName, '', '', 'h');

  });

  $(".saveBtn").on('click', function () {
    saveBtn();
  });

  $('.grammarBtn').on('click', function () {

    var helpNum = prompt('1. 글자서식\n2. 하이퍼링크\n3. 사진 및 그림\n4. 목차\n5. 리스트\n6. 표\n7. 각주\n8. 분류\n9. 인용문\n10. 수식\n11. 틀과 카드\n12. 기타');

    if (helpNum == 1) {

      alert('["굵게"]\n[/기울임/]\n[\'밑줄\']\n[_취소선_]\n[+위첨자+]\n[-아래첨자-]\n[)css문법|내용(] => 자세한 내용은 "상상위키:문법"을 참고하세요');

    } else if (helpNum == 2) {

      alert('[[문서이름]] 또는 [[문서이름|보여줄 이름]]\n일반적인 링크도 가능합니다.' +
        '\n[[https://www.naver.com]]\n특정 문단에 링크를 거는 법\n[[문서이름#p-1-2]] --> 문서의 1.2.번째 목차' +
        '\n학생, 선생님, 동아리 문서는 [[문서이름]]만 적어도 괄호 부분이 삭제된 채로 출력됩니다.');

    } else if (helpNum == 3) {

      alert('[{사진이름.확장자}]\n사진을 업로드 한 후에 사용 가능합니다.');

    } else if (helpNum == 4) {

      alert('=] 1단계\n==] 2단계\n===] 3단계\n====] 4단계');

    } else if (helpNum == 5) {

      alert('순서 있는 리스트\n}내용1\n}내용2\n}내용3};\n순서 없는 리스트\n)내용1\n)내용2\n)내용3);');

    } else if (helpNum == 6) {

      alert(']로 시작하여 \n]로 행을 구분하고 ||로 열을 구분하고 ];로 끝난다.\n좌표로 쓴 예시\n]1,1||1,2||1,3\n]2,1||2,2||2,3\n]3,1||3,2||3,3];' +
        '\n\n각 칸의 왼쪽에 "숫자]숫자]"를 넣으면 숫자만큼 각각 가로, 세로의 칸이 합쳐집니다.' +
        '\n가로로 2칸 세로로 3칸을 합치고 싶으면 "2]3]내용내용"과 같이 사용합니다.');

    } else if (helpNum == 7) {

      alert('{{각주내용}}\n{{각주이름|각주내용}}');

    } else if (helpNum == 8) {

      alert('[#분류이름#]\n한 문서에 여러 분류를 적용할 수 있습니다.\n*분류문법은 문서 맨 위에 사용하는 것을 권장합니다!*');

    } else if (helpNum == 9) {

      alert('[>1단계<]\n[>>2단계<<]\n[>>>3단계<<<]');

    } else if (helpNum == 10) {

      alert('[math(LaTeX문법)]\n문장 사이에 넣을 수 있습니다.\n[Math(LaTeX문법)]\n문장 사이에 넣지 못하며 가운데 정렬 됩니다.');

    } else if (helpNum == 11) {

      alert('[틀(틀 이름)]\n틀 이름은 "틀:"을 제외한 이름입니다.\n[카드(css문법|내용)]');

    } else if (helpNum == 12) {

      alert('수평선(구분선) => ---\n들여쓰기 => :]\n컴퓨터 코드 => [코드(코드 내용)]\n넘겨주기 => [넘겨주기(문서 이름)]\n엔터는 자동으로 적용됩니다.\n\\는 문법이 적용되지 않게 해 줍니다. 예) \\["그대로"]');

    } else if (helpNum.split('m')[0] == "t" && helpNum.split('m')[2] == "3") {

      alert('E |  ast r gg #3\n/wiki');

    }
  });

  $(".exitBtn").on('click', function () {

    if (confirm("편집을 취소하시겠습니까?")) {
      reasonOfMove = '취소';
      let docName = getDocName();
      movePage(docName, '', '', 'w');
    }
  });

  $(".editBtn").on('click', function () {
    let docName = getDocName();
    movePage(docName, '', '', 'e');
  });

  $('.optionBtn').on('click', function () {

    if (!isClicked) {
      isClicked = true;

      checkLevel().then(() => {
        checkAcl(docInfo.name).then(() => {
          var dt = new Date();

          if (docInfo.history == 0) {
            alert('아직 존재하지 않는 문서입니다.');
            isClicked = false;

          } else if (userInfo.full == docInfo.name) {
            if (userInfo.private == true) {

              var answer = prompt('숨김 처리된 본인의 문서입니다.\n본인의 문서가 작성되는 것을 승인하고 싶다면 "승인"을 입력해 주세요.\n3일 뒤에 문서를 다시 숨길 수 있습니다.');
              //\n*유의사항: 승인 시 규칙에 어긋나는 내용을 제외하고 어떠한 내용이 작성되어도 허락한다는 것으로 간주합니다.

              if (answer == '승인') {

                var gt = new Date();
                userRef.child(userInfo.uid).update({
                  time: -1,
                }).then(() => {
                  alert('다시 로그인해서 확인을 눌러주세요');
                  signOut('check');
                });

              } else {
                isClicked = false;
              }


            } else {

              if (userInfo.time > dt.getTime()) {
                var nt = new Date(userInfo.time);

                alert(nt.getFullYear() + '년 ' + (nt.getMonth() + 1) + '월 ' + nt.getDate() + '일 ' + nt.getHours() + '시 부터 다시 숨길 수 있습니다.');
                isClicked = false;

              } else {
                var answer = prompt('본인의 문서입니다.\n본인의 문서가 작성되는 것을 거부하고 싶다면 "거부"를 입력해 주세요.\n다른 사용자의 문서를 편집할 수 없게 됩니다.');

                if (answer == '거부') {
                  firebase.firestore().collection(String(serialize(docInfo.name))).doc(String(docInfo.history)).update({
                    state: 1
                  }).then(() => {
                    userRef.child(userInfo.uid).update({
                      private: true,
                      time: 0
                    }).then(() => {
                      alert('문서가 숨김 처리되었습니다.\n더 이상 이 문서를 편집하거나 열람할 수 없습니다.\n다시 문서를 편집할 수 있게 하고 싶다면 설정에서 "승인"을 입력해주세요.');
                      history.go(0);
                      isClicked = false;
                    })
                  });
                } else {
                  isClicked = false;
                }
              }
            }

          } else if (userInfo.level < 20) {
            alert('권한이 부족합니다.');
            isClicked = false;

          } else {

            var num1 = prompt('1. 문서등급 재설정 (현재 등급: ' + aclInfo.edit + ')\n2. 문서 숨김\n3. 문서 숨김 해제\n4. 문서 삭제\n5. 경고 주기');

            // if(num1 == null || num1 == '') {
            //     isClicked = false;
            // }

            if (num1 == 1) {
              var num2 = prompt('등급을 몇으로 설정하시겠습니까?\n1 => 최소\n15 => 최대\n20 => 부관리자\n100 => 관리자');

              if (num2 > 0 && num2 <= userInfo.level) {
                aclInfo.edit = Number(num2);
                saveAcl(aclInfo, docInfo.serial).then(() => {
                  alert('문서의 등급이 변경되었습니다.');
                  isClicked = false;
                });
              } else if (num2 > userInfo.level) {
                alert('문서의 등급을 자신의 권한보다 높게 설정할 수 없습니다.');
                isClicked = false;
              } else {
                alert('1부터 자신의 권한 사이의 숫자를 입력해 주세요.');
                isClicked = false;
              }
            } else if (num1 == 2) {
              if (docInfo.name.search(/.+\([0-9]+기\)/g) != -1) {
                alert('이 문서는 학생 문서이므로 관리할 수 없습니다.');
                isClicked = false;
              } else if (docInfo.name.search(/.+\(선생님\)/g) != -1) {
                alert('이 문서는 선생님 문서이므로 관리할 수 없습니다.');
                isClicked = false;
              } else {
                if (docInfo.state == 1) {
                  alert('이미 숨겨져 있는 문서입니다.');
                  isClicked = false;
                } else {
                  firebase.firestore().collection(docInfo.serial).doc(String(docInfo.history)).update({
                    state: 1
                  }).then(() => {
                    alert('문서가 숨김 처리되었습니다.\n더 이상 문서를 편집하거나 열람할 수 없습니다.');
                    isClicked = false;
                  });
                }
              }

            } else if (num1 == 3) {
              if (docInfo.name.search(/.+\([0-9]+기\)/g) != -1) {
                alert('이 문서는 학생 문서이므로 관리할 수 없습니다.');
                isClicked = false;
              } else if (docInfo.name.search(/.+\(선생님\)/g) != -1) {
                alert('이 문서는 선생님 문서이므로 관리할 수 없습니다.');
                isClicked = false;
              } else {
                if (docInfo.state == 1) {
                  firebase.firestore().collection(docInfo.serial).doc(String(docInfo.history)).update({
                    state: 0
                  }).then(() => {
                    alert('문서가 숨김 해제되었습니다.\n이제 다시 문서를 편집하거나 열람할 수 있습니다.');
                    isClicked = false;
                  });
                } else {
                  alert('문서가 숨겨져 있지 않습니다.');
                  isClicked = false;
                }
              }

            } else if (num1 == 4) {
              alert('지원하지 않습니다.');
            } else if (num1 == 5) {
              if (docInfo.name.search(/.+\([0-9]+기\)/g) != -1) {

                var warn = Number(prompt('얼마만큼의 경고를 주겠습니까?'));

                if (warn == 'NaN') {
                  alert('숫자를 입력해 주세요.');
                } else {
                  addWarn(docInfo.name, warn);
                }


              } else if (docInfo.name.search(/.+\(선생님\)/g) != -1) {

                var warn = Number(prompt('얼마만큼의 경고를 주겠습니까?'));

                if (warn == 'NaN') {
                  alert('숫자를 입력해 주세요.');
                } else {
                  addWarn(docInfo.name, warn);
                }

              } else {
                alert('이 문서는 사용자의 문서가 아닙니다.');
              }

              isClicked = false;
            } else {
              isClicked = false;
            }
          }
        });
      });
    }
  });
}

var isClicked = false;

// 각주
function addNoteListener() {

  //console.log('note');

  //휴대폰에서 각주 클릭시 블록으로 뜨게 하는 부분은 addAnchorEventListener() 로 옮겨짐.

  $("a[id^=n-]").off().on("mouseenter", function (event) {
    var width = window.innerWidth || document.body.clientWidth;
    if (event.clientX < (width / 2)) {
      $(this).children('div').css('left', 0);
      $(this).children('div').css('right', '');
    } else {
      $(this).children('div').css('right', 0);
      $(this).children('div').css('left', '');
    }
  });
}

//신고
//문서 제목, 몇번째 판인지, 수정한 사람의 별명
const reportRef = firebase.database().ref('REPORT');

function report(docName, editHistory) {

  var reason = prompt('신고하신 이유가 무엇입니까?\n\n숫자를 입력해 주세요.\n1. 욕설 및 비방\n2. 허위 사실 유포\n3. 저작권 침해\n4. 문서 훼손 및 장난\n5. 1~4 외의 규정 위반\n6. 기타');

  if (reason != 1 && reason != 2 && reason != 3 && reason != 4 && reason != 5 && reason != 6 && reason != 7) {
    alert('신고를 취소합니다.');
  } else {
    var memo = '';

    if (reason == 5) {
      memo = prompt('어떤 규정을 위반하였는지 자세하게 적어주세요.');
    } else {
      memo = prompt('자세한 내용을 입력해 주세요.');
    }

    if (reason == 1) {
      reason = '욕설 및 비방';
    } else if (reason == 2) {
      reason = '허위 사실 유포';
    } else if (reason == 3) {
      reason = '저작권 침해';
    } else if (reason == 4) {
      reason = '문서 훼손 및 장난';
    } else if (reason == 5) {
      reason = '기타 규정 위반';
    } else if (reason == 6) {
      reason = '기타적인 이유';
    }

    if (confirm(docName + '의 ' + editHistory + '번째 판을 수정한 사람을 ' + reason + '(으)로 신고하시겠습니까? (신고는 실명으로 접수됩니다.)')) {
      var nt = new Date();

      checkLevel().then(() => {
        reportRef.child(nt.getTime()).set({
          reason: reason,
          memo: memo,
          docName: serialize(docName),
          history: editHistory,
          name: userInfo.full
        }).then(() => {
          alert('신고가 접수되었습니다.');
        }).catch(err => {
          console.log(err);
          alert('신고를 접수하는 중에 오류가 발생하였습니다. 다시 신고해 주세요.');
        });
      });
    } else {
      alert('신고를 취소합니다.');
    }
  }
}

function reportError() {
  if ((error = prompt('어떤 오류가 발생했나요?')) != undefined) {
    if ((situation = prompt('어떤 상황에서 오류가 발생했나요?')) != undefined) {
      if ((memo = prompt('더 설명할 내용이 있다면 입력해주세요.')) != undefined) {
        let errorObj = {
          error: error,
          situation: situation,
          full: userInfo.full,
          url: decodeURI(document.URL),
          memo: memo
        }
        firebase.database().ref('REPORT/ERROR').child(new Date().getTime()).set(errorObj).then(() => {
          alert('오류 제보가 정상적으로 접수되었습니다.')
        })
      } else {
        alert('오류 제보를 취소합니다.');
      }
    } else {
      alert('오류 제보를 취소합니다.');
    }
  } else {
    alert('오류 제보를 취소합니다.');
  }
}