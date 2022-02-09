var debateObj = {};
var docDebateObj = {};

function loadAllDebate() {
  return new Promise(resolve => {

    debateObj = {};
    docDebateObj = {};

    firebase.database().ref('DEBATE').orderByChild('lastComment').limitToLast(12).once('value', function (snap) {
      if (snap.val() != null) {
        debateObj = snap.val();
        if (debateObj['doc'] != undefined) {
          delete debateObj['doc'];
          firebase.database().ref('DEBATE').child('doc').once('value', function (snap) {
            docDebateObj = snap.val();
            delete docDebateObj['lastComment'];
            resolve();
          });
        } else {
          resolve();
        }
      } else {
        resolve();
      }
    });

  })
}

var debateBackColor = '';
var debateColor = '';
var debateState = '';
var debateDoc = '';

function showAllDebate() {

  let debateList = [];

  $('#debateArticle').empty();
  $('article').addClass('hidden');
  $('#debateArticle').removeClass('hidden');
  $("#debateArticle").append('<h2 style="display: flex; justify-content: space-between;">최근 토론<button class="commonBtn" onclick="movePage(`new`, ``, ``, `debate`)">새 토론</button></h2>');
  $("#debateArticle").append('<div id="debateShowDiv"></div>');

  for (key in debateObj) {
    debateList.push(debateObj[key].lastComment + '|' + key);
  }

  if (debateList.length == 0) {
    //토론이 하나도 없음.
    $('#debateShowDiv').append('<p style="font-size: 2rem">진행중인 토론이 존재하지 않습니다.</p>');
  } else {

    debateList.sort(function (a, b) {
      let A = Number(a.split('|')[0]);
      let B = Number(b.split('|')[0]);
      if (A > B) {
        return 1;
      } else {
        return -1;
      }
    });
    //debateList.reverse();

    console.log(debateList);

    for (i in debateList) {
      let key = debateList[i].split('|').pop();
      let val = debateObj[key];


      if (val['state'] == 'open') {
        debateBackColor = 'rgba(255, 0, 0, 0.1)';
        debateColor = 'rgb(255, 0, 0)';
        debateState = '● 토론 중';
      } else if (val['state'] == 'close') {
        debateBackColor = 'rgba(80, 0, 255, 0.1)';
        debateColor = 'rgb(80, 0, 255)';
        debateState = '합의됨';
      } else if (val['state'] == 'pause') {
        debateBackColor = 'rgba(255, 100, 0, 0.1)';
        debateColor = 'rgb(255, 100, 0)';
        debateState = '중단됨';
      } else if (val['state'] == 'wait') {
        debateBackColor = 'rgba(0, 0, 255, 0.1)';
        debateColor = 'rgb(0, 0, 255)';
        debateState = '● 합의 중';
      }

      $("#debateShowDiv").prepend('<div id="d-' + key + '"><div style="background-color: ' + debateBackColor + ';">' +
        '<b class="debateDocB"></b><b style="color: ' + debateColor + ';">' + debateState + '</b></div><p>' + val['title'] + '</p></div>');

      if (val['doc'] == undefined) {
        debateDoc = '기타';
      } else {
        debateDoc = '<a href="w/' + val['doc'] + '">' + val['doc'] + '</a>';
      }

      $("#d-" + key + " .debateDocB").html(debateDoc);

    }
    addDebateEventListener();
    addAnchorEventListener();
  }
}

function addDebateEventListener() {
  $('div[id^=d-] > p').off('click');
  $('div[id^=d-] > p').on('click', function () {
    var debateCode = $(this).parent().attr('id');
    movePage(debateCode.split('-')[1], '', '', 'debate');
  });
}

function newDebate() {

  $('#debateArticle').empty();
  $('article').addClass('hidden');
  $('#debateArticle').removeClass('hidden');

  $("#debateArticle").append('<h2>토론 생성</h2>');
  $("#debateArticle").append('<div id="newDebateDiv"></div>');
  $("#newDebateDiv").append('<div><span>연관 문서: </span><input id="debateDocInput" type="text" placeholder="연관 문서가 없는 경우 작성하지 마세요."></div>');
  $("#newDebateDiv").append('<div><span>토론 주제: </span><input id="debateTitleInput" type="text"></div>');
  $("#newDebateDiv").append('<div><span>토론 내용: </span><textarea id="debateContentTextarea"></textarea></div>');
  $("#newDebateDiv").append('<div><span>합의안: </span><textarea id="debateSettlementTextarea" placeholder="합의안이 없는 경우 작성하지 마세요."></textarea></div>');
  $("#newDebateDiv").append('<button class="commonBtn" onclick="checkNewDebate()">토론 생성</button>');
}

function checkNewDebate() {
  var debateInfo = {
    state: 'open'
  };
  debateInfo.doc = $('#debateDocInput').val().replace(/</g, '&lt;');
  debateInfo.title = $('#debateTitleInput').val().replace(/</g, '&lt;');
  debateInfo.content = $('#debateContentTextarea').val().replace(/</g, '&lt;');
  debateInfo.settlement = $('#debateSettlementTextarea').val().replace(/</g, '&lt;');

  if (debateInfo.title == '' || debateInfo.content == '') {
    alert('토론의 주제 또는 내용을 입력해주세요.');
  } else {
    if (debateInfo.doc == '') {
      if (confirm("연관 문서를 '기타'로 하여 토론을 생성하시겠습니까?")) {
        delete debateInfo.doc;
        createDebate(debateInfo);
      }
    } else if (docNote.indexOf(debateInfo.doc) == -1) {
      if (confirm("존재하지 않는 문서입니다. 연관 문서를 '기타'로 하여 토론을 생성하시겠습니까?")) {
        delete debateInfo.doc;
        createDebate(debateInfo);
      }
    } else {
      createDebate(debateInfo);
    }
  }

}

function makeTime(time) {
  let T = new Date(time).getTime();
  let randList = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  let randCode = randList[Math.floor(Math.random() * 23)] + randList[Math.floor(Math.random() * 23)];

  return String(T) + randCode;
}

function createDebate(debateInfo) {

  let nowT = new Date().getTime();
  let debateTime = makeTime(nowT);

  let userNick = `익명의 전곽인 <span style="font-weight: bold">${userInfo.serial}</span>`;

  checkLevel().then(() => {
    if (userInfo.level >= 20) {
      userNick = '<span class="adminNameSpan"><b>' + userNick + '</b></span>';
    }

    debateInfo.nick = userNick;
    debateInfo.full = userInfo.full;

    debateInfo.lastComment = nowT;

    firebase.database().ref('COMMENT').child(debateTime).child(debateTime).set({
      content: debateInfo.content,
      nick: userNick,
      full: userInfo.full,
      time: nowT,
      type: 'normal',
      state: true,
      code: debateTime
    }).then(() => {
      delete debateInfo.content;

      if (debateInfo.settlement != '') {

        let code2 = makeTime(nowT + 1);
        //합의안이 있는 경우
        firebase.database().ref('COMMENT').child(debateTime).child(code2).set({
          content: debateInfo.settlement,
          nick: userNick,
          full: userInfo.full,
          time: nowT + 1,
          type: 'settlement',
          state: true,
          code: code2
        }).then(() => {
          delete debateInfo.settlement;
          firebase.database().ref('DEBATE').child(debateTime).set(debateInfo).then(() => {
            if (debateInfo.doc != undefined) {
              firebase.database().ref('DEBATE/doc').child(serialize(debateInfo.doc)).child(debateTime).set(true).then(() => {
                alert('토론 생성이 완료되었습니다.');
                movePage('all', '', '', 'debate');
              })
            } else {
              alert('토론 생성이 완료되었습니다.');
              movePage('all', '', '', 'debate');
            }
          });
        });
      } else {

        //합의안이 없는 경우
        delete debateInfo.settlement;
        firebase.database().ref('DEBATE').child(debateTime).set(debateInfo).then(() => {
          if (debateInfo.doc != undefined) {
            firebase.database().ref('DEBATE/doc').child(serialize(debateInfo.doc)).child(debateTime).set(true).then(() => {
              alert('토론 생성이 완료되었습니다.');
              movePage('all', '', '', 'debate');
            })
          } else {
            alert('토론 생성이 완료되었습니다.');
            movePage('all', '', '', 'debate');
          }
        });
      }
    });
  });
}

var commentObj = {};
var commentNum = 1;
var nowDebateKey = '';

function loadDebate(debateKey) {

  if (nowDebateKey != '') {
    //다른(이전) 토론의 댓글이 올라오지 않도록
    firebase.database().ref('COMMENT').child(nowDebateKey).orderByKey().off('child_added');
    firebase.database().ref('COMMENT').child(nowDebateKey).orderByKey().off('child_changed');
  }

  console.log(debateObj);
  nowDebateKey = debateKey;
  commentObj = {};
  commentNum = 0;

  userAgree = {
    true: 'none',
    false: 'none'
  };

  agreeObj = {};


  if (debateKey == '') {
    movePage('all', '', '', 'debate');
  } else if (debateObj[debateKey] == undefined) {
    $("#debateArticle").append('<div id="debateTitleDiv"><p>존재하지 않는 토론입니다.</p></div>');
  } else {

    if (debateObj[debateKey]['doc'] == undefined) {
      $("#debateArticle").append('<div id="debateTitleDiv"><p>기타 | ' + debateObj[debateKey]['title'] + '</p></div><hr/>');
    } else {
      $("#debateArticle").append('<div id="debateTitleDiv"><p>' + debateObj[debateKey]['doc'] + ' | ' + debateObj[debateKey]['title'] + '</p></div><hr/>');
    }

    $("#debateArticle").append('<div id="debateCommentDiv"></div>');
    $("#debateArticle").append('<hr/><div id="addCommentDiv"></div>');

    checkLevel().then(() => {

      let userNick = `익명의 전곽인 <span style="font-weight: bold">${userInfo.serial}</span>`;

      if (userInfo.level >= 20) {
        userNick = '<span class="adminNameSpan"><b>' + userNick + '</b></span>';
      }

      if (userInfo.level >= 20) {

        $("#addCommentDiv").append('<div id="c-add"><div><span><b>#?</b> | ' +
          userNick + '</span></div><textarea></textarea></div><div id="debateButtonDiv" style="display: flex; justify-content: flex-end;"></div>');
        $("#debateButtonDiv").append('<button onclick="addComment(`settlement`)" style="background-color: rgba(0, 0, 255, 0.1); color: rgb(0, 0, 255); border-color: rgb(0, 0, 255);">합의안</button>' +
          '<button onclick="addComment(`normal`)" style="background-color: rgba(0, 0, 0, 0.1); color: rgb(0, 0, 0);">댓글</button>');
        $("#debateButtonDiv").prepend('<button onclick="addComment(`command`)" style="background-color: rgba(255, 100, 0, 0.1); color: rgb(255, 100, 0); border-color: rgb(255, 100, 0);">커맨드</button>' +
          '<button onclick="addComment(`close`)" style="background-color: rgba(80, 0, 255, 0.1); color: rgb(80, 0, 255); border-color: rgb(80, 0, 255);">종료</button>');
      } else {
        if (debateObj[debateKey].state != 'close') {
          if (debateObj[debateKey].state == 'pause') {
            $("#addCommentDiv").append('<div id="c-add"><div><span><b>#?</b> | ' +
              userNick + '</span></div><textarea disabled>중단된 토론입니다.</textarea></div><div id="debateButtonDiv" style="display: flex; justify-content: flex-end;"></div>');
          } else {
            $("#addCommentDiv").append('<div id="c-add"><div><span><b>#?</b> | ' +
              userNick + '</span></div><textarea></textarea></div><div id="debateButtonDiv" style="display: flex; justify-content: flex-end;"></div>');
            $("#debateButtonDiv").append('<button onclick="addComment(`settlement`)" style="background-color: rgba(0, 0, 255, 0.1); color: rgb(0, 0, 255); border-color: rgb(0, 0, 255);">합의안</button>' +
              '<button onclick="addComment(`normal`)" style="background-color: rgba(0, 0, 0, 0.1); color: rgb(0, 0, 0);">댓글</button>');
          }
        } else {
          //종료된 토론
          //아무것도 추가하지 않는다.
        }
      }

      loadComments(debateKey).then(() => {
        addNoteBubble();
        commentTag();
        moveToHash();
        addAnchorEventListener();
        addCommentListener(debateKey);

        debateStateListener(debateKey);
      })
    });
  }
}

function debateStateListener(debateKey) {
  firebase.database().ref('DEBATE').child(debateKey).on('child_changed', snap => {
    checkLevel().then(() => {
      let userNick = `익명의 전곽인 <span style="font-weight: bold">${userInfo.serial}</span>`;

      if (userInfo.level >= 20) {
        userNick = '<span class="adminNameSpan"><b>' + userNick + '</b></span>';
      }

      if (userInfo.level < 20) {
        if (snap.val() == 'pause') {
          $("#addCommentDiv").empty();
          $("#addCommentDiv").append('<div id="c-add"><div><span><b>#' + (commentNum + 1) + '</b> | ' +
            userNick + '</span></div><textarea disabled>중단된 토론입니다.</textarea></div><div id="debateButtonDiv" style="display: flex; justify-content: flex-end;"></div>');
        } else if (snap.val() == 'close') {
          $("#addCommentDiv").empty();
        } else {
          let temporaryContent = $('#c-add > textarea').val() || '';
          $("#addCommentDiv").empty();
          $("#addCommentDiv").append('<div id="c-add"><div><span><b>#' + (commentNum + 1) + '</b> | ' +
            userNick + '</span></div><textarea></textarea></div><div id="debateButtonDiv" style="display: flex; justify-content: flex-end;"></div>');
          $("#debateButtonDiv").append('<button onclick="addComment(`settlement`)" style="background-color: rgba(0, 0, 255, 0.1); color: rgb(0, 0, 255); border-color: rgb(0, 0, 255);">합의안</button>' +
            '<button onclick="addComment(`normal`)" style="background-color: rgba(0, 0, 0, 0.1); color: rgb(0, 0, 0);">댓글</button>');
          $('#c-add > textarea').val(temporaryContent);
          $('#c-add > textarea').focus();
        }
      }
    })
  })
}

var commentsNoteIndex = 0;

function loadComments(debateKey) {
  return new Promise((resolve, reject) => {
    commentObj = {};
    commentNum = 0;
    commentsNoteIndex = 0;
    console.log(debateKey);
    firebase.database().ref('COMMENT').child(debateKey).orderByKey().once('value', function (snap) {

      refreshCommentsLoop(snap, Object.keys(snap.val()), 0).then(() => {
        resolve();
      })

    });
  });
}

function refreshCommentsLoop(snap, keyList, num) {
  return new Promise((resolve, reject) => {

    let key = keyList[num];
    let comment = snap.val()[key];

    if (comment == undefined) {

      resolve();

    } else {

      commentNum += 1;

      $("#debateCommentDiv").append('<div id="c-' + commentNum + '"></div>');

      comment.noteIndex = commentsNoteIndex;
      grammar('load', comment).then(commentInfo => {
        commentsNoteIndex = commentInfo.noteIndex;
        refreshComment(commentInfo, key).then(() => {
          refreshCommentsLoop(snap, keyList, num + 1).then(() => {
            resolve();
          })
        })
      });
    }

  });
}

function addCommentListener(debateKey) {
  firebase.database().ref('COMMENT').child(debateKey).orderByKey().off('child_added');
  firebase.database().ref('COMMENT').child(debateKey).orderByKey().off('child_changed');

  firebase.database().ref('COMMENT').child(debateKey).orderByKey().on('child_added', function (snap) {

    console.log(snap.key);
    if (commentObj[snap.key] == undefined) {
      //아직 추가되지 않은 새로운 코멘트라면

      console.log('코멘트 추가');

      commentNum += 1;

      $("#debateCommentDiv").append('<div id="c-' + commentNum + '"></div>');

      let comment = snap.val();

      comment.noteIndex = commentsNoteIndex;

      grammar('load', comment).then(commentInfo => {
        commentsNoteIndex = commentInfo.noteIndex;
        refreshComment(commentInfo, snap.key).then(() => {
          addNoteBubble();
          commentTag();
          addAnchorEventListener();
        })

      });
    }

  });

  firebase.database().ref('COMMENT').child(debateKey).on('child_changed', function (snap) {

    console.log('코멘트 변경');
    let commentInfo = snap.val();

    commentInfo.content = commentObj[snap.key].content;

    refreshComment(commentInfo, snap.key);
  });
}

var commentColor = '';
var agreeObj = {};
var agreeNum = 0;
var disagreeNum = 0;
var waitTime = 0;
var commentTime = '';
//내가 어느 합의안에 찬성, 반대 했는지 //{true: 12, false: none}
var userAgree = {
  true: 'none',
  false: 'none'
};


//key = commentKey임
function refreshComment(commentInfo, key) {

  return new Promise((resolve, reject) => {

    commentObj[key] = commentInfo;

    let keyList = Object.keys(commentObj);

    let code = keyList.indexOf(key) + 1;

    // console.log(commentObj);
    // console.log(key);
    // console.log(keyList);

    $('#c-add > div > span > b').text('#' + (commentNum + 1));

    if (commentObj[key] == undefined) {
      console.log('comment End');
      resolve();
    } else if (commentObj[key].state == false) {
      //숨긴거니까 넘어감.
      console.log('hidden comment');
      $("div[id=c-" + code + "]").addClass('hidden');
      resolve();
    } else {

      console.log('add or change comment');
      $("div[id=c-" + code + "]").removeClass('hidden');
      $("div[id=c-" + code + "]").empty();

      var ct = new Date(commentInfo['time']);
      commentTime = timeFormat(ct);

      if (commentInfo['type'] == 'normal') {
        commentColor = 'rgba(0, 0, 0, 0.05)';
      } else if (commentInfo['type'] == 'settlement' || commentInfo['type'] == 'wait') {
        commentColor = 'rgba(0, 0, 255, 0.1)';
      } else if (commentInfo['type'] == 'close') {
        commentColor = 'rgba(80, 0, 255, 0.1)';
      } else if (commentInfo['type'] == 'command') {
        commentColor = 'rgba(255, 100, 0, 0.2)';
      }

      agreeObj[key] = commentInfo['agree'] || {};

      agreeNum = 0;
      disagreeNum = 0;

      for (name in agreeObj[key]) {

        if (name == userInfo.full) {
          if (agreeObj[key][name]) {
            //내가 찬성했다면
            userAgree['true'] = key;

          } else {
            //내가 반대했다면
            userAgree['false'] = key;

          }
        }

        if (agreeObj[key][name]) {
          agreeNum += 1;
        } else {
          disagreeNum += 1;
        }
      }

      agreeObj[key]['agree'] = agreeNum;
      agreeObj[key]['disagree'] = disagreeNum;

      if (commentInfo['type'] == 'settlement') {

        if (waitSettlementKey == key) {
          //이의제기가 종료된 합의안
          waitSettlementKey = 'none';
        }

        $("div[id=c-" + code + "]").append('<div style="background-color: ' + commentColor + ';">' +
          '<span><b id="' + code + '">#' + code + '</b> | ' + commentInfo['nick'] + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>' +
          commentTime + '</span></div><pre>' + commentInfo['content'] + '</pre>' +
          '<div class="settlementBtnDiv"><button onclick="agreeFunction(true, `' + key + '`)" id="agree-' + key + '" class="agreeBtn">찬성 ' + agreeNum + '</button>' +
          '<button onclick="agreeFunction(false, `' + key + '`)" id="disagree-' + key + '" class="disagreeBtn">반대 ' + disagreeNum + '</button></div>');

      } else if (commentInfo['type'] == 'wait') {

        waitSettlementKey = key;
        waitTime = parseInt((commentInfo['waitTime'] - new Date().getTime()) / 60000);

        if (waitTime <= 0) {
          //이의제기 기간 종료
          waitTime = 0;

          if (debateObj[nowDebateKey].state != 'pause') {
            commandFunction({
                content: '중단>>합의안 [[#c-' + commentNum + '|#' + commentNum + ']]의 이의제기 기간이 종료되었으므로 관리자가 확인 후 처리하기까지 토론을 중단합니다.'
              },
              '<span class="adminNameSpan"><b>시스템</b></span>', '시스템');
          }

        }

        $("div[id=c-" + code + "]").append('<div style="background-color: ' + commentColor + ';">' +
          '<span><b id="' + code + '">#' + code + '</b> | ' + commentInfo['nick'] + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>' +
          commentTime + '</span></div><pre>' + commentInfo['content'] + '</pre>' +
          '<div class="settlementBtnDiv"><button onclick="agreeFunction(true, `' + key + '`)" id="agree-' + key + '" class="agreeBtn">찬성 ' + agreeNum + '</button>' +
          '<span id="waitTimeSpan">' + waitTime + '분</span>' +
          '<button onclick="agreeFunction(false, `' + key + '`)" id="disagree-' + key + '" class="disagreeBtn">반대 ' + disagreeNum + '</button></div>');

      } else {
        $("div[id=c-" + code + "]").append('<div style="background-color: ' + commentColor + ';">' +
          '<span><b id="' + code + '">#' + code + '</b> | ' + commentInfo['nick'] + '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>' +
          commentTime + '</span></div><pre>' + commentInfo['content'] + '</pre>');
      }

      if (userAgree['true'] != 'none') {
        $("#agree-" + userAgree['true']).css('font-weight', 'bold');
      }

      if (userAgree['false'] != 'none') {
        $("#disagree-" + userAgree['false']).css('font-weight', 'bold');
      }


      //중단되거나 종료된 토론이면 찬성, 반대 버튼 안 눌리게
      if (debateObj[nowDebateKey].state == 'close' || debateObj[nowDebateKey].state == 'pause') {

        $(".agreeBtn").attr('disabled', true);
        $(".disagreeBtn").attr('disabled', true);

      }

      resolve();
    }
  });
}

function commentTag() {
  $('#debateCommentDiv > div > div > span > b').off('click');
  $('#debateCommentDiv > div > div > span > b').on('click', function () {
    //코멘트 태그
    $("#addCommentDiv textarea").val($("#addCommentDiv textarea").val() + '[[#' + $(this).attr('id') + ']]');
  });
}

function addComment(type) {
  var temporaryCommentInfo = {
    content: $("#addCommentDiv textarea").val().replace(/</g, '&lt;')
  };
  if (temporaryCommentInfo.content == '') {
    alert('내용을 입력해 주세요.');
  } else if (type == 'command') {
    let userNick = `익명의 전곽인 <span style="font-weight: bold">${userInfo.serial}</span>`;

    checkLevel().then(() => {
      if (userInfo.level >= 20) {
        userNick = '<span class="adminNameSpan"><b>' + userNick + '</b></span>';
      }
      commandFunction(temporaryCommentInfo, userNick, userInfo.full);
    });
  } else {

    let userNick = `익명의 전곽인 <span style="font-weight: bold">${userInfo.serial}</span>`;

    checkLevel().then(() => {
      if (userInfo.level >= 20) {
        userNick = '<span class="adminNameSpan"><b>' + userNick + '</b></span>';
      }

      let nowT = new Date().getTime();
      let timeCode = makeTime(nowT);

      $("#addCommentDiv textarea").val('');
      firebase.database().ref('DEBATE').child(nowDebateKey).child('lastComment').set(nowT).then(() => {
        firebase.database().ref('COMMENT').child(nowDebateKey).child(timeCode).set({
          nick: userNick,
          full: userInfo.full,
          time: nowT,
          content: temporaryCommentInfo.content,
          type: type,
          state: true,
          code: timeCode
        }).then(() => {
          if (type == 'close') {
            firebase.database().ref('DEBATE').child(nowDebateKey).child('state').set(type);
          }
        })
      })
    });
  }
}

function commandFunction(commandInfo, commandNick, commandFull) {

  let commandOption;
  commandInfo.type = 'command';

  if (commandInfo.content.split('>>')[0] == '중단') {
    //커맨드로 "pause>>내용" 을 입력.

    commandOption = 'pause';

    commandInfo.content = commandInfo.content.split('>>').slice(1).join('>>');

    if (commandInfo.content == '') {
      commandInfo.content = '토론을 중단합니다.';
    }

  } else if (commandInfo.content.split('>>')[0] == '변경' && commandInfo.content.split('>>')[1] != undefined && commandInfo.content.split('>>')[1] != '') {

    commandOption = 'change';

    commandInfo.changeDoc = commandInfo.content.split('>>')[1];

    commandInfo.content = commandInfo.content.split('>>').slice(2).join('>>');


    if (docNote.indexOf(commandInfo.changeDoc) == -1) {
      alert('존재하지 않는 문서입니다.');
      return;
    }

    if (commandInfo.content == '') {
      commandInfo.content = '토론의 연관 문서를 [\"' + commandInfo.changeDoc + '\"](으)로 변경합니다.';
    }

  } else if (commandInfo.content.split('>>')[0] == '재개') {
    //커맨드로 "pause>>내용" 을 입력.

    commandOption = 'reopen';

    commandInfo.content = commandInfo.content.split('>>').slice(1).join('>>');

    if (commandInfo.content == '') {
      commandInfo.content = '토론을 재개합니다.';
    }

  } else {
    alert('정확한 커맨드를 입력해주세요.');
    return;

  }

  $("#addCommentDiv textarea").val('');

  let nowT = new Date().getTime();
  let timeCode = makeTime(nowT);

  firebase.database().ref('DEBATE').child(nowDebateKey).child('lastComment').set(nowT).then(() => {
    firebase.database().ref('COMMENT').child(nowDebateKey).child(timeCode).set({
      nick: commandNick,
      full: commandFull,
      time: nowT,
      content: commandInfo.content,
      type: commandInfo.type,
      code: timeCode
    }).then(() => {
      if (commandOption == 'pause') {
        firebase.database().ref('DEBATE').child(nowDebateKey).child('state').set('pause');
      } else if (commandOption == 'change') {
        firebase.database().ref('DEBATE/doc').child(serialize(commandInfo.changeDoc)).child(nowDebateKey).set(true).then(() => {
          firebase.database().ref('DEBATE').child(nowDebateKey).child('doc').set(serialize(commandInfo.changeDoc)).then(() => {
            if (debateObj[nowDebateKey]['doc'] != undefined) {
              firebase.database().ref('DEBATE/doc').child(debateObj[nowDebateKey]['doc']).child(nowDebateKey).set(null);
            }
          });
        });
      } else if (commandOption == 'reopen') {
        firebase.database().ref('DEBATE').child(nowDebateKey).child('state').set('open');
      }
    });
  });
}

function agreeFunction(agreeType, settlementKey) {

  if (agreeType) {
    //찬성 버튼 클릭
    if (settlementKey != userAgree['true']) {
      //원래 찬성하던 합의안이 아니라면
      if (settlementKey == userAgree['false']) {
        //원래 반대하던 합의안이라면
        $("#disagree-" + userAgree['false']).css('font-weight', '400');
        userAgree['false'] = 'none';
      }

      if (userAgree['true'] != 'none') {
        //원래 찬성하던 합의안이 있었다면
        var temporaryAgreeKey = userAgree['true'];
        $("#agree-" + temporaryAgreeKey).css('font-weight', '400');
        userAgree['true'] = 'none';
        firebase.database().ref('COMMENT').child(nowDebateKey).child(temporaryAgreeKey).child('agree').child(userInfo.full).set(null).then(() => {
          firebase.database().ref('COMMENT').child(nowDebateKey).child(settlementKey).child('agree').child(userInfo.full).set(true).then(() => {
            settlementFunction(true, settlementKey);
          });
        })
      } else {
        //원래 찬성하던 합의안이 없었다면
        firebase.database().ref('COMMENT').child(nowDebateKey).child(settlementKey).child('agree').child(userInfo.full).set(true).then(() => {
          settlementFunction(true, settlementKey);
        });
      }
    } else {
      //찬성을 취소?
    }
  } else {
    //반대 버튼 클릭
    if (settlementKey != userAgree['false']) {
      //원래 반대하던 합의안이 아니라면

      if (settlementKey == userAgree['true']) {
        //원래 찬성하던 합의안이라면
        $("#agree-" + userAgree['true']).css('font-weight', '400');
        userAgree['true'] = 'none';
      }

      if (userAgree['false'] != 'none') {
        //원래 반대하던 합의안이 있었다면
        var temporaryDisagreeKey = userAgree['false'];
        $("#disagree-" + temporaryDisagreeKey).css('font-weight', '400');
        userAgree['false'] = 'none';
        firebase.database().ref('COMMENT').child(nowDebateKey).child(temporaryDisagreeKey).child('agree').child(userInfo.full).set(null).then(() => {
          firebase.database().ref('COMMENT').child(nowDebateKey).child(settlementKey).child('agree').child(userInfo.full).set(false).then(() => {
            settlementFunction(false, settlementKey);
          })
        })
      } else {
        //원래 반대하던 합의안이 없었다면
        firebase.database().ref('COMMENT').child(nowDebateKey).child(settlementKey).child('agree').child(userInfo.full).set(false).then(() => {
          settlementFunction(false, settlementKey);
        });
      }
    } else {
      //반대를 취소?
    }
  }
}

//현재 이의제기 기간을 거치고 있는 합의안의 키
var waitSettlementKey = 'none';

function settlementFunction(choiceType, settlementKey) {
  if (choiceType) {
    //settlementKey 합의안에 찬성함.
    if (waitSettlementKey == 'none') {
      //이의제기 기간인 합의안이 없음.
      if ((agreeObj[settlementKey]['agree'] - agreeObj[settlementKey]['disagree']) >= 3) {
        //찬성이 반대보다 3이상 많다면 => 이 합의안을 이의제기 대기 상태로 만든다. (wait)
        firebase.database().ref('COMMENT').child(nowDebateKey).child(settlementKey).update({
          type: 'wait',
          waitTime: new Date().getTime() + 12 * 60 * 60 * 1000
        }).then(() => {
          firebase.database().ref('DEBATE').child(nowDebateKey).child('state').set('wait');
        })
      }
    } else {
      //이의제기 기간인 합의안이 있다.
      if (settlementKey != waitSettlementKey) {
        //두 합의안이 다르다면
        if ((agreeObj[settlementKey]['agree'] - agreeObj[settlementKey]['disagree']) == (agreeObj[waitSettlementKey]['agree'] - agreeObj[waitSettlementKey]['disagree'])) {
          //현재 이의제기 중인 합의안의 찬성-반대 가 새로운 합의안의 찬성-반대와 같아지면 이의 제기 종료
          firebase.database().ref('COMMENT').child(nowDebateKey).child(waitSettlementKey).update({
            type: 'settlement',
            waitTime: null
          }).then(() => {
            firebase.database().ref('DEBATE').child(nowDebateKey).child('state').set('open').then(() => {
              //나중에 찬성을 얻은 이 합의안이 우위를 가짐. 둘 다 찬성-반대 가 같지만 만약 이 합의안이 3을 넘었다면 이의제기 기간을 시작함.
              settlementFunction(choiceType, settlementKey);
            })
          })
        }
      }
    }
  } else {
    //settlementKey 합의안에 반대함.
    if (agreeObj[settlementKey]['agree'] <= agreeObj[settlementKey]['disagree']) {
      //이 합의안의 반대가 더 많거나 같아지면
      if (waitSettlementKey == settlementKey) {
        //이 합의안이 이의제기 중인 합의안이면 => 이의 제기 종료
        firebase.database().ref('COMMENT').child(nowDebateKey).child(waitSettlementKey).update({
          type: 'settlement',
          waitTime: null
        }).then(() => {
          firebase.database().ref('DEBATE').child(nowDebateKey).child('state').set('open');
        })
      }
    }
  }
}

var isCtrl = false;
var isAlt = false;
var isShift = false;

document.onkeyup = function (e) {
  if (e.which == 16) isShift = false;
  if (e.which == 17) isCtrl = false;
  if (e.which == 18) isAlt = false;
}


document.onkeydown = function (e) {
  if (e.which == 16) isShift = true;
  if (e.which == 17) isCtrl = true;
  if (e.which == 18) isAlt = true;

  if (isShift && e.which == 13) {
    //shift enter

  } else if (isAlt && e.which == 13) {
    //alt enter
    addComment('normal');
  } else if (isCtrl && e.which == 13) {
    //ctrl enter
    addComment('settlement');
  } else if (isCtrl && e.which == 38) {
    //up Arrow
    location.href = '#debateArticle';
  } else if (isCtrl && e.which == 40) {
    //down Arrow
    location.href = '#c-add';
    $('#c-add > textarea').focus();
  }
}