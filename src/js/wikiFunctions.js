MathJax = {
  tex: {
    inlineMath: [
      ['$|', '|$']
    ],
    displayMath: [
      ['$$|', '|$$']
    ]
  }
};

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
    if (load < 0) {
      load = 0;
    }
    //console.log(load);
    if (load == 0) {

      //console.log('loading end');
      $('#uploadDiv').css('opacity', 1);

      $('#loginDiv').addClass('hidden');
    }
  }
}

//시간을 받아서 형식화시킴
function timeFormat(time) {
  return time.getFullYear() + '/' + (time.getMonth() + 1) + '/' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes();
}

//바이트 구하는 함수
function getByteLength(s, b, i, c) {
  for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 7 ? 2 : 1);
  return b;
}

//신고 확인하기
function checkReport() {
  checkLevel().then(() => {
    if (userInfo.level >= 20) {
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
    if (userInfo.level >= 20) {
      reportRef.child(time).set(null).then(() => {
        console.log('완료');
      });
    }
  });
}

//경고 주기
function addWarn(name, add) {
  checkLevel().then(() => {
    if (userInfo.level >= 20) {
      if (!isNaN(add)) {
        userRef.child(name).child('warn').once('value', function (warn) {
          userRef.child(name).child('warn').set(warn.val() + add).then(() => {
            if (Number(warn.val() + add) >= 3) {
              var dt = new Date();
              userRef.child(name).child('time').set(dt.getTime() + (2 ** (warn.val() + add - 2)) * 86400000).then(() => {

                alert(name + '의 경고 횟수를 ' + Number(warn.val() + add) + '(으)로 바꾸었습니다.\n' +
                  name + '의 계정이 ' + (2 ** (warn.val() + add - 2)) + '일간 차단됩니다.');
              });
            } else {
              alert(name + '의 경고 횟수를 ' + Number(warn.val() + add) + '(으)로 바꾸었습니다.');
            }
          });
        });
      }
    }
  });
}




//검색 관련 작업들!//검색 관련 작업들!//검색 관련 작업들!//검색 관련 작업들!//검색 관련 작업들!//검색 관련 작업들!
$("#searchBtn").click(function () {
  search();

});

function search() {
  //console.log(autoCompleteNum);
  if (autoCompleteNum == 0) {
    var inputT = $("#searchTxt").val();
    var autoT = $("#auto_1>a").text();
    if (inputT.toUpperCase().replace(/ /g, '') == autoT.toUpperCase().replace(/ /g, '')) {
      var input = $("#auto_1>a").text();
      //console.log(input);
      movePage(input, '', '', 'w');
    } else {
      var input = $("#searchTxt").val();
      //console.log(input);
      movePage(input, '', '', 's');
    }
  } else {
    var input = $("#auto_" + autoCompleteNum + '>a').text();
    //console.log(input);
    movePage(input, '', '', 'w');
  }

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
      //console.log('#auto_' + Number(autoCompleteNum + 1));
      //console.log($('#auto_' + Number(autoCompleteNum + 1)).length);
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
var matchList;
//propertychange change keyup paste input
$('#searchTxt').on("change keyup paste", function () {
  var keycode = event.keyCode;
  //console.log(keycode);
  if (keycode != 40 && keycode != 38) {
    //$(this).focusout();
    changeKey();

  } else if (keycode == 40) {
    //이상하게도 오류가 생겨서 필요함.
    if (autoCompleteNum == 0) {
      if (!$('#auto_1').hasClass('choiceUpDown')) {
        autoUpDown(40);
      }
    }

  }
});

function changeKey() {
  autoCompleteNum = 0;
  $('#auto_1').remove();
  $('#auto_2').remove();
  $('#auto_3').remove();
  $('#auto_4').remove();
  $('#auto_5').remove();
  $('#auto_6').remove();

  var input = $('#searchTxt').val();

  if (input != undefined) {
    //console.log("현재 검색어 => " + input);
    matchList = new Array();
    for (var i = 0; docNote.length > i; i++) {

      if (Hangul.search(docNote[i].replace(/ /g, '').toUpperCase(), input.replace(/ /g, '').toUpperCase()) != -1) {
        matchList.push(docNote[i]);
      }
    }

    //자동완성된 검색어들을 정렬
    matchList.sort(function (a, b) {
      //검색어 내에 원하는 검색어가 앞에 있을수록 순위가 높음.
      if (Hangul.search(a, input) > Hangul.search(b, input)) {
        return 1;
      } else if (Hangul.search(a, input) < Hangul.search(b, input)) {
        return -1;
      } else {
        //위치가 같다면 길이가 더 짧은 검색어가 순위가 높음.
        if (a.length < b.length) {
          return -1;
        } else if (a.length > b.length) {
          return 1;
        } else {
          //길이마저 같다면 아스키 순서로
          if (a > b) {
            return 1;
          } else if (a < b) {
            return -1;
          } else {
            //이럴 수는 없다.
            return 0;
          }
        }
      }
    });

    matchList.splice(5);

    //console.log(matchList);

    matchList.forEach(function (val, index) {

      var width = window.innerWidth || document.body.clientWidth;
      var top = 0;
      if (width <= 800) {
        top = index * 4.2 + 14;
      } else {
        top = index * 4.5 + 11;
      }
      $('#searchDiv').append('<div id="auto_' + (index + 1) + '" style="top:' +
        top + 'rem;"><a href="w/' + val + '">' +
        val.replace(/%20/g, ' ') + '</a></div>');
    });

    addAnchorEventListener();
  }
}

var autoHref;

$(document).on("mouseenter", "div[id^=auto]", function () {
  $(this).children('a').addClass('autoHover');
  autoHref = $('.autoHover').attr('href').split('/').slice(1).join('/');
});

$(document).on("mouseleave", "div[id^=auto]", function () {
  $(this).children('a').removeClass('autoHover');
  autoHref = undefined;
});


$('#searchTxt').on('blur', function () {
  if (autoHref == undefined) {

    $('#auto_1').remove();
    $('#auto_2').remove();
    $('#auto_3').remove();
    $('#auto_4').remove();
    $('#auto_5').remove();
    $('#auto_6').remove();
  } else {
    movePage(autoHref, '', '', 'w');
  }
});

$('#searchTxt').on('focus', function () {
  changeKey();
});


var isC = true;
//랜덤문서
$('#randomLabel').on('click', function () {
  isC = true;
  console.log(isC);
  if (!$('#randomInput').is(':checked')) {
    $('#randomDiv').children().remove();
    let count = docNote.length;

    // 77은 상관없는 숫자임.
    if (Math.floor(Math.random() * 77) == 0) {
      isC = false;
      $('#randomDiv').append('<p class="adminNameSpan" onclick="javascript:isC = true; alert(`당신이 원하는 곳으로 인도하겠습니다...`); firebase.auth().signOut(); history.go(0);">눌러보고 싶지 아니한가</p>');
      window.setTimeout(function () {
        if (!isC) {
          alert('A | E s e E g #1\ne->g->tmxjrm3');
        }
      }, 8000);
    } else {
      let width = window.innerWidth || document.body.clientWidth;

      for (var i = 0; i < 3;) {
        let randomDoc = docNote[Math.floor(Math.random() * (count))];
        $('#randomDiv').append("<p onclick='movePage(`" + randomDoc + "`, ``, ``, `w`);'>" + randomDoc + '</p>');
        if (width <= 800) {
          i += 3;
        } else if (width <= 1300) {
          i += 2;
        } else {
          i += 1;
        }
      }
    }
  }
});

//서버작업//서버작업//서버작업//서버작업//서버작업//서버작업//서버작업//서버작업//서버작업//서버작업
const firebaseConfig = {
  apiKey: "AIzaSyCQvwbRqPzW6td9QdibAaDaFDQNjs7idJw",
  authDomain: "ideawiki-2020.firebaseapp.com",
  databaseURL: "https://ideawiki-2020.firebaseio.com",
  projectId: "ideawiki-2020",
  storageBucket: "ideawiki-2020.appspot.com",
  messagingSenderId: "903071152955",
  appId: "1:903071152955:web:07ebba81b14fd511d5151e",
  measurementId: "G-MSGMXBXMPL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const jshsusConfig = {
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

//qjxms zmfflr ghlttn
var bcn = 0;

var pw = '';
var id = '';

function signIn(_id, password) {

  pw = password;
  id = _id;

  if (id == "" || pw == "") {
    bcn += 1;
    if (bcn == 6) {
      alert('C | E,a,s,t,e,r,E,g,g #2\n/eeqr');
    } else {
      alert("모든 항목을 채워 주세요.");
    }
  } else {
    //var emailCheckRegex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    $('#signInDiv').addClass('hidden');
    $('#authLoadDiv').removeClass('hidden');
    firebase.database().ref('ID').child(id).once('value', function (snap) {
      if (snap.val() == null) {
        jshsusUser.child('ID/' + id).once('value', function (snapshot) {
          if (snapshot.val() == null) {
            alert('일치하는 회원정보가 존재하지 않습니다.\n상상위키는 과구리의 계정과 연동됩니다.\n아직 과구리에 가입하지 않으셨다면 가입하고 다시 로그인 해 보세요.');
            $('#signInDiv').removeClass('hidden');
            $('#authLoadDiv').addClass('hidden');
          } else {
            jshsLogIn(snapshot.val().email, pw);
          }
        });
      } else {
        wikiLogIn(snap.val(), pw);
      }
    })
  }
}

function wikiLogIn(email, pw) {
  firebase.auth().signInWithEmailAndPassword(email, pw).catch(function (error) {
    if (error.code == "auth/wrong-password") {
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    } else if (error.code == "auth/user-not-found") {
      alert('일치하는 회원정보가 존재하지 않습니다.');
    } else {
      alert('예기치 않은 오류가 발생했습니다.\n잠시 후에 다시 이용해 주세요.');
    }
    $('#signInDiv').removeClass('hidden');
    $('#authLoadDiv').addClass('hidden');
  });
}

function jshsLogIn(email, pw) {
  auth.signInWithEmailAndPassword(email, pw).catch(function (error) {
    if (error.code == "auth/wrong-password") {
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    } else if (error.code == "auth/user-not-found") {
      alert('일치하는 회원정보가 존재하지 않습니다.\n상상위키는 과구리의 계정과 연동됩니다.\n아직 과구리에 가입하지 않으셨다면 가입하고 다시 로그인 해 보세요.');
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

//정보 불러오기
const userRef = firebase.database().ref('USER');
var userInfo = {
  level: 1,
  warn: 0,
  edit: 0,
  private: 'true',
  time: 0,
  gisu: -1,
  name: '익명',
  nick: '<>익명<>',
  full: '익명(99기)',
  serial: 0 //토론에 쓰임
};

// 로그아웃
function signOut(reason) {

  if (reason == 'check') {
    firebase.auth().signOut();
    reasonOfMove = '로그아웃';
    history.go(0);
  } else {
    if (confirm('로그아웃 하시겠습니까?')) {

      firebase.auth().signOut();
      reasonOfMove = '로그아웃';
      history.go(0);

    }
  }
}

function checkLevel() {
  return new Promise(resolve => {

    console.log('checkLevel');

    var user = firebase.auth().currentUser;

    //유저가 존재하는지 확인
    if (user == null) {
      userInfo.level = 0;
      resolve();
    } else {

      console.log('로그인 중 2');

      //방금 정보를 가지고 위키유저의 정보에서 검색
      userRef.child(user.uid).once('value', function (snap) {


        if (snap.val() == null) {

          console.log('newAccount');

          //최초 로그인 한 경우

          createUser(user).then(() => {
            auth.signOut().then(() => {
              movePage('상상위키:규정', '', '', 'w');
              alert('처음 방문하셨군요! "상상위키:규정" 문서를 꼭 읽어주세요!');
              resolve();
            })
          })



        } else {

          //console.log('존재하던 계정임');

          //비밀번호 제거
          pw = '';

          //기존 사용자

          let gt = new Date();

          userInfo = snap.val();


          //차단 여부 확인
          if (userInfo.warn > 2 && userInfo.time > gt.getTime()) {

            let dt = new Date(userInfo.time);
            alert('이 계정은 ' + (dt.getMonth() + 1) + '월 ' + dt.getDate() + '일까지 차단되었습니다.');
            firebase.auth().signOut();
            history.go(0);

          } else {

            if (userInfo.warn > 2) {
              //차단 풀림
              userRef.child(userInfo.uid).update({
                warn: 2,
                time: 0
              }).then(() => {
                alert('차단이 해제되었습니다. 다시 로그인해주세요.');
                auth.signOut();
                history.go(0);
              });

            } else {
              //차단 상관 없을 때


              //문서 숨김 해제 확인 절차
              if (userInfo.time == -1) {
                if (prompt('본인이 직접 문서 숨김을 해제하셨다면 "확인"을 입력해주세요') == "확인") {
                  firebase.firestore().collection(String(serialize(userInfo.full))).orderBy('history', 'desc').limit(1).get().then(snap => {
                    //console.log(snap.docs[0].data());

                    firebase.firestore().collection(String(serialize(userInfo.full))).doc(String(snap.docs[0].data().history)).update({
                      state: 0
                    }).then(() => {
                      userRef.child(userInfo.uid).update({
                        time: gt.getTime() + 259200000,
                        private: false
                      }).then(() => {
                        userInfo.private = false;
                        alert('문서가 숨김 해제되었습니다.\n이제 당신의 문서를 누구나 편집하거나 열람할 수 있습니다.\n다시 편집할 수 없게 하고 싶다면 3일 뒤에 설정에서 "거부"를 입력해주세요.');
                        history.go(0);
                      });
                    });
                  });
                } else {
                  userRef.child(userInfo.uid).update({
                    time: 0,
                  }).then(() => {
                    alert('누군가가 사용자의 문서를 숨김 해제하려고 시도했습니다.');
                    //프로필 설정
                    $('#nickP').html(userInfo.nick + '<br><span style="font-size:1.7rem">기여도:' + userInfo.edit + ' | 등급:' + userInfo.level + ' | 경고:' + userInfo.warn + '</span>');
                    resolve();
                  });
                }
              } else {
                //프로필 설정
                $('#nickP').html(userInfo.nick + '<br><span style="font-size:1.7rem">기여도:' + userInfo.edit + ' | 등급:' + userInfo.level + ' | 경고:' + userInfo.warn + '</span>');
                resolve();
              }

            }
          }
        }
      });
    }
  });
}

//과구리에 로그인했다는 것은 아직 계정이 없다는 것.
auth.onAuthStateChanged(function (user) {
  if (user) {
    let email = user.email;
    if (pw == '') {
      //어쩌다가 로그인되어버린 상황이라 로그아웃 시킨다.
      auth.signOut();
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, pw).then(() => {
        //비밀번호 제거
        pw = '';
      });
    }
  }
});

function createUser(user) {
  return new Promise((resolve, reject) => {

    //이메일을 통해 기수와 이름을 확인
    email = user.email.split('.').join('%');
    jshsusUser.child('EMAIL').child(email).once('value', function (snapshot) {
      console.log(snapshot.val());
      userInfo.gisu = snapshot.val().gisu;
      userInfo.name = snapshot.val().name;

      if (userInfo.gisu == 0) {
        userInfo.nick = '선생님:' + userInfo.name;
        userInfo.full = '선생님:' + userInfo.name;
      } else {
        userInfo.nick = userInfo.gisu + '기:' + userInfo.name;
        userInfo.full = userInfo.gisu + '기:' + userInfo.name;
      }

      console.log(user);
      userInfo.uid = user.uid;
      userInfo.level = 1;
      userInfo.warn = 0;
      userInfo.private = false;
      userInfo.time = 0;

      $('#nickP').html(userInfo.nick + '<br><span style="font-size:1.7rem">기여도:0 | 등급:1 | 경고:0</span>');

      //id와 email 저장
      firebase.database().ref('ID').child(id).set(user.email).then(() => {
        //userInfo 저장
        if (serialize(userInfo.full) != undefined) {
          //본인의 문서가 이미 존재
          userInfo.serial = serialize(userInfo.full);
          userRef.child(userInfo.uid).set(userInfo).then(() => {
            resolve();
          });

        } else {
          //본인의 문서가 아직 없음

          //처음에 본인 문서 만들면서 오르기 때문에 미리 마이너스.
          userInfo.edit = -2;
          userInfo.make = -1;

          let keywordObject = {
            [userInfo.name]: 1,
            [userInfo.gisu]: 1
          };

          let byte = getByteLength(userInfo.gisu + "기 " + userInfo.name + "의 문서입니다.");

          checkAcl(userInfo.full).then(() => {

            saveFunction({
              name: userInfo.full,
              state: 0,
              history: 0,
              document: {
                content: userInfo.gisu + "기 " + userInfo.name + "의 문서입니다."
              },
              byte: byte,
              time: new Date().getTime(),
              comment: '',
              editorNick: userInfo.nick,
              editorFull: userInfo.full,
              keyword: keywordObject,
              link: {},
              highClass: ['미분류'],
              lowClass: [],
              lowDoc: [],
              changedByte: byte
            }, 1).then(() => {

              console.log(userInfo);

              userInfo.serial = serialList.length - 1;

              userRef.child(userInfo.uid).set(userInfo).then(() => {

                //미분류에 분류시키기.
                addDocToClass(userInfo.full, ['미분류'], 0).then(() => {
                  resolve();

                })

              });
            });
          });
        }
      });
    });
  });
}

//user 기여도 변동시 처리 함수.
function userScoreChange() {
  return new Promise((resolve, reject) => {
    if (userInfo.edit >= userInfo.level * userInfo.level * 3 && userInfo.level < 15) {
      //레벨업 조건을 충족하면
      userInfo.level += 1;
      userRef.child(userInfo.uid).child('level').set(userInfo.level).then(() => {

        $('#nickP').html(userInfo.nick + '<br><span style="font-size:1.7rem">기여도:' + userInfo.edit + ' | 등급:' + userInfo.level + ' | 경고:' + userInfo.warn + '</span>');
        alert('기여도를 ' + userInfo.edit + '만큼 쌓으셨네요.\n등급이 ' + userInfo.level + '(으)로 올랐습니다.');
        userLevelChange().then(() => {
          loadRank();
          resolve();
        })
      });
    } else {
      $('#nickP').html(userInfo.nick + '<br><span style="font-size:1.7rem">기여도:' + userInfo.edit + ' | 등급:' + userInfo.level + ' | 경고:' + userInfo.warn + '</span>');
      loadRank();
      resolve();
    }
  });
}

function userLevelChange() {
  return new Promise((resolve, reject) => {

    if (userInfo.level >= 20) {
      userInfo.nick = '<span class="adminNameSpan"><b>' + userInfo.full + '</b></span>';
    } else if (userInfo.level >= 15) {
      userInfo.nick = '<span class="BNNameSpan"><b>' + userInfo.full + '</b></span>';
    } else if (userInfo.level >= 12) {
      userInfo.nick = '<span style="color:rgb(50, 50, 200)"><b>' + userInfo.full + '</b></span>';
    } else if (userInfo.level >= 9) {
      userInfo.nick = '<span style="color:rgb(50, 100, 255)"><b>' + userInfo.full + '</b></span>';
    } else if (userInfo.level >= 5) {
      userInfo.nick = '<span style="color:rgb(100, 220, 100)"><b>' + userInfo.full + '</b></span>';
    } else {
      userInfo.nick = userInfo.full;
    }

    userRef.child(userInfo.uid).child('nick').set(userInfo.nick).then(() => {
      resolve();
    })
  });
}



//문서와 관련된 작업//문서와 관련된 작업//문서와 관련된 작업//문서와 관련된 작업//문서와 관련된 작업//문서와 관련된 작업

//위키 문서 불러오기//위키 문서 불러오기//위키 문서 불러오기//위키 문서 불러오기//위키 문서 불러오기//위키 문서 불러오기


//모든 문서를 시리얼 순서로 정리한 리스트 //이름은 decoding 된 상태이다.
var docNote = [];
//삭제된 문서들의 시리얼을 저장해 논 오브젝트이다. // 문서이름: 시리얼
var removeNote = {};

var docInfo = {
  state: 0,
  history: 0, //기존의 편집 횟수 -> 저장 시 +1
  byte: 1, //기존의 바이트 -> 저장 시 편집된 바이트
  changedByte: 1, //바뀐 바이트 양
  name: '상상위키:대문', //관리자(28기) //점이나 스페이스 바 그대로 가져옴.
  comment: '',
  editorFull: '', // 편집자의 이름과 기수 (선생님은 기수가 0)
  editorNick: '', // 편집자의 닉네임 (꾸며진 이름/색깔같은 것/역사에 표시)
  time: 0,
  type: 'user',
  document: {}, //문서의 내용이 체계화되어 정리됨.//목차 제목만 인코딩
  highClass: [], //상위 분류 배열//디코딩
  lowClass: [], //하위 분류 배열 //디코딩
  lowDoc: [], //하위 문서 배열 //디코딩
  redirect: '', //넘겨주기 문서 이름 //디코딩
  keyword: {}, //키워드 오브젝트이다.
  lastClass: [], //원래 분류가 들어있는 배열 //디코딩
  serial: 0, //시리얼 넘버
  link: {} //역링크용
}

var movePoint = {
  type: 'w',
  doc: '상상위키:대문',
  hash: '',
  question: ''
}

//아스키 코드 16진수
function decode(text) {
  text = text.replace(/%2E/g, '.');
  text = text.replace(/%23/g, '#');
  text = text.replace(/%24/g, '$');
  text = text.replace(/%5B/g, '[');
  text = text.replace(/%5D/g, ']');
  text = text.replace(/%2F/g, '/');
  text = text.replace(/%3F/g, '?');
  text = text.replace(/%5C/g, '\\');
  text = text.replace(/%7C/g, '|');
  return text;
}

function encode(text) {
  text = text.replace(/\./g, '%2E');
  text = text.replace(/\#/g, '%23');
  text = text.replace(/\$/g, '%24');
  text = text.replace(/\[/g, '%5B');
  text = text.replace(/\]/g, '%5D');
  text = text.replace(/\//g, '%2F');
  text = text.replace(/\?/g, '%3F');
  text = text.replace(/\\/g, '%5C');
  text = text.replace(/\|/g, '%7C');
  return text;
}


//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------


//movePoint는 {type: e, doc: document, hash: p-1-2, question: from=redirect } 형식이다. document의 점이나 스페이스바는 그대로 들어온다.
function movePage(docData, hashData, questionData, typeData, btnData) {

  // console.log(hashData);
  // console.log(rediData);
  // console.log(docData);
  // console.log(typeData);


  docData = decode(docData);
  var lastDocName = movePoint.doc;
  var lastDocType = movePoint.type;
  var lastDocQuestion = movePoint.question;

  movePoint.doc = docData;
  movePoint.type = typeData;
  movePoint.hash = hashData;
  movePoint.question = questionData;

  if (docData == '.') {
    if (movePoint.question == '') {
      movePoint.question = 'doc=.';
    } else {
      movePoint.question = 'doc=.&' + movePoint.question;
    }
  }

  console.log(movePoint);

  $('#commentInput').val('');
  $('.titleH1').text(docData);

  if (btnData == undefined) {
    var hash = (movePoint.hash == '') ? '' : '#' + movePoint.hash;
    var question = (movePoint.question == '') ? '' : '?' + movePoint.question;
    //console.log('히스토리 추가 => ' + hash);

    window.history.pushState(null, null, '/' + movePoint.type + '/' + movePoint.doc + question + hash);

  }

  if (lastDocName != movePoint.doc || lastDocType != movePoint.type) {

    loadDoc();
  } else if (movePoint.type == 'h' && lastDocName == movePoint.doc && lastDocQuestion != movePoint.question) {
    loadDoc();
  }


}

//문서 불러오기
function loadDoc() {

  console.log('loadDoc');

  if (movePoint.type == 's') {
    loadSearchType();
  } else if (movePoint.type == 'debate') {

    loadAllDebate().then(() => {
      window.scrollTo(0, 0);

      if (movePoint.doc == 'all') {
        showAllDebate();
      } else if (movePoint.doc == 'new') {
        newDebate();
      } else {
        loadDebateType();
      }
    })

  } else if (movePoint.type == 'd') {

  } else if (movePoint.type == 'upload') {

    loadUploadType();

  } else if (movePoint.type == 'h') {

    loadHistoryType();

  } else {

    docInfo = {};

    docInfo.name = movePoint.doc;

    //문서 존재 여부//삭제된 문서는 제외 (역사번호를 알아야 하기 때문에 불러와야 함.)
    if (serialNote[docInfo.name] == undefined && removeNote[docInfo.name] == undefined) {

      docInfo.history = 0;
      docInfo.document = {
        content: ''
      };
      docInfo.byte = 0;
      docInfo.state = 0;


      if (movePoint.type == 'w') {
        //읽기
        loadReadType(true);

      } else if (movePoint.type == 'e') {

        //편집
        docInfo.link = {}; //빈 오브젝트가 존재해야 함.
        checkAcl(docInfo.name);
        refreshDocInfo(docInfo.name);
        loadEditType(true);

      }
    } else {

      firebase.firestore().collection(String(serialize(docInfo.name))).orderBy('history', 'desc').limit(1).get({
        source: 'server'
      }).then(field => {

        docInfo = field.docs[0].data();

        docInfo.highClass = classListFormat(docInfo.highClass, 1);
        docInfo.lowClass = classListFormat(docInfo.lowClass, 1) || [];
        docInfo.lowDoc = classListFormat(docInfo.lowDoc, 3) || [];

        //console.log(docInfo);

        docInfo.name = inv_serialize(docInfo.serial);
        refreshDocInfo(docInfo.name);

        //서버에서 불러온 체계화된 정보를 하나의 텍스트로 바꾸는 과정임.
        docInfo.content = '';

        if (movePoint.type == 'w') {

          mainGrammar('load').then(() => {
            grammar('load').then(() => {
              loadReadType(false);
            });
          });

        } else if (movePoint.type == 'e') {

          checkAcl(docInfo.name).then(() => {
            checkLevel().then(() => {
              mainGrammar('edit').then(() => {
                grammar('edit').then(() => {
                  if (aclInfo.edit > userInfo.level) {
                    alert('이 문서를 편집하기에는 권한이 부족합니다.');
                    loadEditType(false);
                  } else {
                    loadEditType(false);
                  }
                })
              });
            })
          })
        }
      });
    }
  }
}

function checkType(docName) {

  if (docName.split(':')[0] == '상상위키') {

    return 'wiki';

  } else if (docName.split(':')[0] == '파일') {

    return 'file';

  } else if (docName.split(':')[0].search(/[1-9]+기/) != -1) {

    return 'user';

  } else if (docName.split(':')[0] == '선생님') {

    return 'user';

  } else if (docName.split(':')[0] == '분류') {

    return 'class';

  } else if (docName.split(':')[0] == '틀') {

    return 'frame';

  } else {

    return 'doc';
  }
}


//docInfo의 name과 type와 level을 정한다.
function refreshDocInfo(docName) {

  docInfo.name = docName;

  docInfo.type = checkType(docInfo.name);
}

//읽기 모드 w
function loadReadType(isNew) {

  //각주가 겹쳐버리기 때문에 제거
  $('#debateArticle').empty();
  $('#showHistoryP').empty();
  $('#documentW').empty();

  //#때문에 미리 스크롤 해둔다.
  window.scrollTo(0, 0);

  if (isNew) {

    $('#documentW').html('아직 존재하지 않는 문서입니다.');
    $('.historyNumP').text('(새 문서)');
    loadEnd('w');


  } else if (docInfo.state == 2) {

    $('#documentW').html('아직 존재하지 않는 문서입니다.');
    $('.historyNumP').text('(새 문서)');
    loadEnd('w');

  } else {

    makeIndexList().then(indexTxt => {

      //console.log(indexTxt);

      //console.log(docInfo.content);

      if (indexTxt != '<div id="index" class="whiteBlock"></div>') {
        docInfo.content = docInfo.content.split('<hr/>');
        docInfo.content[1] = indexTxt + docInfo.content[1];
        docInfo.content = docInfo.content.join('<hr/>');
      }

      //숨김 여부
      if (docInfo.state == 1) {

        $('#documentW').html('이 문서는 숨김 처리된 문서입니다.\n열람 및 편집을 금합니다.');
        $('.historyNumP').text('(숨김)');

      } else {
        $('#documentW').html(docInfo.content);
        $('.historyNumP').text((docInfo.history) + '번째 수정판');
      }

      addRedirectAlert();


      addParagraphBtn();

      addAnchorEventListener();

      addNoteBubble();

      loadEnd('w');



    });
  }
}

//분류 문서 편집시 잘라낸 나머지
var realClassContent;
//편집 모드 e$
function loadEditType(isNew) {

  //각주가 겹쳐버리기 때문에 제거
  $('#debateArticle').empty();
  $('#showHistoryP').empty();
  $('#documentW').empty();

  window.scrollTo(0, 0);

  if (isNew) {

    $('#documentE').val('새로운 문서를 편집합니다.');
    $('.historyNumP').text('1번째 편집');
    loadEnd('e');


  } else if (docInfo.state == 2) {

    $('#documentE').val('새로운 문서를 편집합니다.');
    $('.historyNumP').text((docInfo.history + 1) + '번째 편집');
    loadEnd('e');


  } else {

    if (docInfo.state == 1) {

      $('#documentE').val('이 문서는 숨김 처리된 문서입니다.\n열람 및 편집을 금합니다.');
      $('.historyNumP').text('(숨김)');
      loadEnd('e');


    } else {

      $('#documentE').val(docInfo.content);

      //grammar(docInfo.content, 0);
      $('.historyNumP').text((docInfo.history + 1) + '번째 편집');
      loadEnd('e');

    }
  }
}

function loadSearchType() {

  window.scrollTo(0, 0);

  $('article').addClass('hidden');
  $('#searchArticle').removeClass('hidden');

  $('#searchTxt').val(movePoint.doc);

  //console.log('blur');
  $('#searchTxt').blur();

  startSearch();
}

function loadDebateType() {

  //각주가 겹쳐버리기 때문에 제거
  $('#debateArticle').empty();
  $('#showHistoryP').empty();
  $('#documentW').empty();

  $('article').addClass('hidden');
  $('#debateArticle').removeClass('hidden');

  loadDebate(movePoint.doc);
}

function loadUploadType() {

  $('article').addClass('hidden');
  $('#uploadArticle').removeClass('hidden');

  loadUploadInterface();
}

function loadHistoryType() {

  //각주가 겹쳐버리기 때문에 제거
  $('#debateArticle').empty();
  $('#showHistoryP').empty();
  $('#documentW').empty();

  $('article').addClass('hidden');
  $('.historyNumP').text('(역사)');
  $('#checkHistoryDiv').text('역사를 불러오는 중입니다.');
  $('#historyArticle').removeClass('hidden');

  addBtnListener();
  loadHistory(movePoint);
}

//문서 로딩 끝
function loadEnd(type) {

  $('#searchTxt').val('');
  changeKey();

  $('#auto_1').remove();
  $('#auto_2').remove();
  $('#auto_3').remove();
  $('#auto_4').remove();
  $('#auto_5').remove();
  $('#auto_6').remove();

  autoCompleteNum = 0;


  if (type == 'w') {

    MathJax.typeset();


    $('article').addClass('hidden');
    $('#documentArticle').removeClass('hidden');

    $('.preTxt').empty();

    moveToHash();

  } else if (type == 'e') {

    $('article').addClass('hidden');
    $('#editArticle').removeClass('hidden');

    $('#documentE').scrollTop(0);
  }

  $('.alertPre').remove();
  //   $('article').prepend(`<pre class="alertPre"
  //     style="font-size: 1.7rem;
  //     margin: 0;
  //     border: 0.3rem solid red;
  //     padding: 1rem;
  //     word-break: break-word;
  //     white-space: break-spaces;
  //     margin-bottom: 2rem">
  // <b style="color: red">한동안은 학생 및 선생님에 관한 언급과 문서 생성 및 편집을 금지합니다.</b>
  // 학교 수업에서 배운 내용을 정리하거나 동아리 문서를 편집하는 등의 활동을 해주세요.
  // 규정을 꼭 읽고, 교지 수준의 검열을 한다고 생각하고 작성하세요.
  // </pre>`);
  addBtnListener();
  loading(false);
}

//앵커 태그 무효화
function addAnchorEventListener() {

  //console.log('anchor');

  $('a').off('click');

  $('a').on('click', function (event) { // a태그 클릭시 작동

    var hrefTxt = $(this).attr("href");

    //console.log(hrefTxt);

    if (hrefTxt[0] == '?') {
      //역사에서 쓰이는 그런 것
      event.preventDefault();
      movePage(movePoint.doc, '', hrefTxt.substring(1), movePoint.type);
    } else if (hrefTxt.search(/https?:\/\//g) != -1) {
      //alert('link');
    } else if (hrefTxt[0] != '#' && (hrefTxt[0] == 'w' || hrefTxt[0] == 'e' || hrefTxt[0] == 'd' || hrefTxt[0] == 'h') && hrefTxt[1] == '/') {
      event.preventDefault();
      //console.log(hrefTxt);

      //링크의 타입 w, e, h 등
      var hrefType = hrefTxt.split('/')[0];
      //링크 목적지 #이나 ?있을 수 있음.
      hrefTxt = hrefTxt.split('/').slice(1).join('/');
      //문서 제목이 존재하는지 확인
      if (serialize(hrefTxt) == undefined) {
        //없다면 #이나 ?때문임. 또는 그냥 없는 문서

        if (hrefTxt.length == 1) {
          //문서 제목이 ?나 #인 경우임.
          movePage(hrefTxt, '', '', hrefType);
        } else if (hrefTxt.search(/\#$/) != -1 || hrefTxt.search(/\?$/) != -1) {
          //문서 제목이 ?나 #으로 끝나는 경우
          movePage(hrefTxt, '', '', hrefType);
        } else {

          let temporaryLink;
          let hashLink;
          let questionLink;

          if (hrefTxt.search(/#/) != -1) {
            //#존재
            temporaryLink = hrefTxt.split('#');
            hashLink = temporaryLink.pop();
            temporaryLink = temporaryLink.join('#');

            if (temporaryLink.search(/\?/) != -1) {
              //?도 존재
              temporaryLink = temporaryLink.split('?');
              questionLink = temporaryLink.pop();
              temporaryLink = temporaryLink.join('?');
              movePage(temporaryLink, hashLink, questionLink, hrefType);
            } else {
              //?는 없음
              movePage(temporaryLink, hashLink, '', hrefType);
            }

          } else if (hrefTxt.search(/\?/) != -1) {
            //?있음
            temporaryLink = hrefTxt.split('?');
            questionLink = temporaryLink.pop();
            temporaryLink = temporaryLink.join('?');
            movePage(temporaryLink, '', questionLink, hrefType);
          } else {
            //아직 없는 문서
            movePage(hrefTxt, '', '', hrefType);
          }

        }
      } else {
        //아무것도 없음.
        movePage(hrefTxt, '', '', hrefType);
      }
    } else if (hrefTxt[0] == '#') {

      //각주 같은 것

      //각주라면
      if (hrefTxt[1] == 'f' && hrefTxt[2] == '-') {

        //console.log($(this).attr('id'));
        if ($(this).attr('id') == undefined) {
          //이 부분은 휴대폰에서 각주 안에 있는 a태그를 클릭했을 때를 의미한다.
          window.location.href = hrefTxt;
        } else {


          var width = window.innerWidth || document.body.clientWidth;
          //console.log(width);
          //화면이 작다면 => 휴대폰에서는 클릭 시 각주 보이게
          if (width <= 800) {
            //console.log(id);
            event.preventDefault();
            if ($(this).children('div').css('visibility') == 'hidden') {
              $('.noteDiv').css('visibility', 'hidden');
              $(this).children('div').css('visibility', 'visible');
            } else {
              $(this).children('div').css('visibility', 'hidden');
            }
          }
        }
      } else {
        //일반 앵커
        //window.location.href = hrefTxt;
      }
    } else {
      event.preventDefault();
      //console.log(hrefTxt);

      movePage(hrefTxt, '', '', 'w');
      //console.log(hrefTxt);
      //window.history.pushState(null, null, hrefTxt);
    }
  });
}

//목차 바로가기 생성
function makeIndexList(DOCINFO) {
  return new Promise(resolve => {

    if (DOCINFO == undefined) {
      DOCINFO = docInfo;
    }
    if (DOCINFO.type != 'class') {

      //목차 생성
      var indexTxt = '<div id="index" class="whiteBlock">';

      //index list로 [{hNum: 1, pNum: 2, title: title}, {}, {}] 형식으로 저장됨
      var indexMatchList = [];

      //replace 함수로 목차 리스트 찾아서 받아오기
      DOCINFO.content.replace(/<h([1-5]) id="p-(.+?)"><a href="#index">.+?<\/a>&nbsp;(.+?)<\/h[1-5]>/g,
        function (match, hNum, pNum, title) {
          indexMatchList.push({
            hNum: hNum,
            pNum: pNum,
            title: title
          });
          return match; //이 줄은 필요없을 듯. 혹시 모르니
        });

      //console.log(indexMatchList);

      for (var indexMatchNum = 0; indexMatchNum < indexMatchList.length; indexMatchNum++) {

        var indexInfo = indexMatchList[indexMatchNum];

        for (var i = 2; i < indexInfo.hNum; i++) {
          indexTxt = indexTxt.concat('&nbsp;&nbsp;');
        }

        indexTxt = indexTxt.concat('<a href="#p-' + indexInfo.pNum + '">' + indexInfo.pNum.split('-').join('.') + '.</a>&nbsp;' +
          indexInfo.title + "<br>");
      }

      resolve(indexTxt + "</div>");
    } else {
      resolve('');
    }
  });
}


//#으로 지정된 곳으로 이동
function moveToHash() {

  console.log('moveToHash');
  if (movePoint.hash != '') {
    isHash = true;
    window.location.href = '#' + movePoint.hash;

  }

}

//리다이렉트 시 알림 추가
function addRedirectAlert() {
  if (movePoint.question.split('=')[0] == 'from' && movePoint.question != 're=-1') {
    var fromDoc = movePoint.question.split('from=').pop();
    $('#documentW').prepend('<p id="redirectAlertP"><a style="cursor:pointer" href="w/' + fromDoc + '?re=-1">' +
      fromDoc + '</a> 에서 넘어옴</p>');
    addAnchorEventListener();
  }
}

//각주들에 말풍선 달아주기 //#f-3 이런 식
function addNoteBubble() {

  console.log('addNoteBubble');

  $('.noteDiv').remove();

  $("a[id^=n-]").each(function () {
    let note = $("div[id^=f-" + $(this).attr("href").split('-')[1] + "]").html();
    //console.log(note);

    $(this).append('<div class="noteDiv container">' + note + '</div>');

  });
  addNoteListener();

}

//문단마다 접고 펴는 버튼 추가
function addParagraphBtn() {

  $('.bpLabel').remove();
  $('input[id^=bp-]').remove();

  var hTags = $('*[id^=p-]');

  //console.log(hTags);

  for (var i = 0; i < hTags.length; i++) {
    $(hTags[i]).prepend('<input type="checkbox" class="fold hidden" id="b' + $(hTags[i]).attr('id') + '">' +
      '<label style="user-select: none" class="bpLabel" for="b' + $(hTags[i]).attr('id') + '">' +
      '<img src="/src/img/foldbutton.png" style="width: 2rem; display: inline-block; margin-right: .5rem;">' +
      '</label>');
  }

  //문단 접고 펴는 버튼 작동 함수
  $(".fold + label").on('click', function () {

    //console.log($(this).prev().is(":checked"));
    $(this).parent().next().slideToggle(300);
    if (!$(this).prev().is(":checked")) {
      $(this).children().css('transform', 'rotate(' + (-90) + 'deg)');
    } else {
      $(this).children().css('transform', 'rotate(' + 0 + 'deg)');
    }
  });
}

//----------------------------------------------------------------------------------------------------------------------------

//추천 문서 보여주기 //수정 필요
function showRecommend() {

  var relation;
  firebase.database().ref('RELATIONSHIP').once('value', function (snap) {
    relation = snap.val()
    var tag = relation[serialize(docInfo.name)]
    if (relation[serialize(docInfo.name)] == undefined) {
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
      //console.log(arr);
      for (i = 0; i < arr.length; i++) {
        if (inv_serialize(arr[i][0]) != undefined) {
          $('div[id=suyeon146]').append('<div class="container">' + '<a href="w/' + inv_serialize(arr[i][0]) + '">' + inv_serialize(arr[i][0]) + '</a></div>' + '<hr>');
        };
      };
    }


  });
}

//----------------------------------------------------------------------------------------------------------------------------------------


//$('article[class^=whiteBlock]').append('<div id="learning" style="display:none"><p>이 문서와 가장 관련있다고 생각하는 문서 1개의 제목을 아래에 입력해 주세요. 여러분의 많은 참여가 상상위키를 발전시킵니다.</p><input id="lrn" type="text" name="title"><input type="button" onclick="learning_function()" value="확인"></div>')
// 학습버튼
var relations;
firebase.database().ref('RELATIONSHIP').once('value', function (happyRelation) {
  relations = happyRelation.val();
});

//학습버튼 함수 //수정 필요
function learning_function() {
  var targetle = $('#lrn').val();
  //console.log(targetle);
  if (serialize(targetle) != undefined) {
    if (targetle == fullName) {
      alert("이 문서는 추천할 수 없습니다.")
    } else {
      var titleSerial = serialize(targetle);
      if (relations[serialize(docInfo.name)][titleSerial] != undefined) {
        if (relations[serialize(docInfo.name)][titleSerial]['std_fdp'] == undefined) {
          var saveed_std = 0
        } else {
          var saveed_std = relations[serialize(docInfo.name)][titleSerial]['std_fdp'];
        }
        if (relations[serialize(docInfo.name)][titleSerial]['tot_fdp'] != undefined) {
          firebase.database().ref('RELATIONSHIP').child(serialize(docInfo.name)).child(titleSerial).update({
            std_fdp: (saveed_std + 0.4)
          }).then(() => {
            //console.log("done");
            $("div[id=learning]").remove();
          });
        } else {
          eval("firebase.database().ref('RELATIONSHIP').child(" + serialize(docInfo.name) + ").update({" + titleSerial + ": { tot_fdp: 0, std_fdp: (saveed_std + 0.4) } })").then(() => {
            //console.log("done");
            $("div[id=learning]").remove();
          });
        }
      } else {
        eval("firebase.database().ref('RELATIONSHIP').child(" + serialize(docInfo.name) + ").update({" + titleSerial + ": { tot_fdp: 0, std_fdp: 0.4 } })").then(() => {
          //console.log("done");
          $("div[id=learning]").remove();
        });
      }
    }

  } else {
    alert("존재하지 않는 문서입니다.")
  }
}

//------------------------------------------------------------------------------------------------------------------------------------------

//문서 제목: 시리얼 의 형태로 저장되어 있는 오브젝트
var serialNote = {};
//시리얼: 문서 제목 의 형태롤 저장되어 있는 오브젝트
var inv_serialNote = {};

var friendList;
//앞으로 쓸 씨리얼 함수
function serialize(title) {
  if (serialList.indexOf(title) == -1) {
    return undefined;
  } else {
    return serialList.indexOf(title);
  }
}
//씨리얼 역함수
function inv_serialize(serial) {
  return serialList[serial];
}


function friendMaker(DOCINFO) {
  return new Promise(function (resolve) {
    //console.log(serialNote[docInfo.name]);

    firebase.database().ref('RELATIONSHIP').child(DOCINFO.serial).once('value', function (snap) {
      friendList = snap.val();

      var saved_std_fdp = [];
      if (friendList != null) {
        saved_std_fdp = friendList
      }
      var list_update = [];
      var tempList = (DOCINFO.content.match(/\[\[.+?]]/g) || []);
      for (p = 0; p < tempList.length; p++) {
        if (serialize(tempList[p].split("|", 1)[0].replace("[[", "").replace("]]", "")) != undefined) {
          list_update.push(serialize(tempList[p].split("|", 1)[0].replace("[[", "").replace("]]", "")));
          //console.log(list_update);
        };
      };
      //console.log(list_update);

      //content의 docInfo.name을 시리얼로 받아 list_update에 추가
      //console.log(1);
      var finalUpdate = [];

      function listcountmaker() {
        for (p = 0; p < list_update.length; p++) {
          eval("cnt_" + list_update[p] + "=" + "0");
        };
      }

      listcountmaker(); //(cnt+list_update[p])을 전역변수로 선언
      //console.log(1);
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
      //console.log(finalUpdate);
      var finalObject = new Object();

      for (i = 0; i < finalUpdate.length; i++) {
        eval("var relative" + "=" + "5*(1-0.8**(cnt_" + finalUpdate[i] + "));");

        if (saved_std_fdp[finalUpdate[i]] == undefined) {
          finalObject[finalUpdate[i]] = {
            tot_fdp: relative,
            std_fdp: 0
          }
        } else {
          if (saved_std_fdp[finalUpdate[i]]['std_fdp'] == undefined) {
            finalObject[finalUpdate[i]] = {
              tot_fdp: relative,
              std_fdp: 0
            };
          } else {
            finalObject[finalUpdate[i]] = {
              tot_fdp: relative,
              std_fdp: saved_std_fdp[finalUpdate[i]]['std_fdp']
            }
          }
          //console.log(finalObject)
        }

      }
      firebase.database().ref('RELATIONSHIP').child(DOCINFO.serial).set(null).then(() => {
        firebase.database().ref('RELATIONSHIP').child(DOCINFO.serial).set(finalObject).then(() => {
          //console.log("done");
          resolve();
        });
      });
    });
  });
}


//위키 문서 저장하기//위키 문서 저장하기//위키 문서 저장하기//위키 문서 저장하기//위키 문서 저장하기//위키 문서 저장하기
//type = 2 => 삭제 / undefined => 저장 / 1 => 사용자 문서 생성중. / 3 => 분류 변경 (생성, 삭제 아님) / 4 => 분류 생성
function saveFunction(_DOCINFO, type) {

  return new Promise((resolve, reject) => {

    $('#logP').text('사용자 정보를 수정하는 중');

    console.log('start saveEffect');

    saveEffect(_DOCINFO, type).then((DOCINFO) => {

      if (type != 2) {
        $('#logP').text(inv_serialize(DOCINFO.serial) + ' 문서를 분류하는 중');
      }

      console.log('start saveClass');

      saveClass(DOCINFO).then(() => {

        console.log('format DOCINFO');

        if (type != 2) {
          $('#logP').text(inv_serialize(DOCINFO.serial) + ' 문서를 저장하는 중');
        }

        delete DOCINFO.addedClass;
        delete DOCINFO.removedClass;


        DOCINFO.highClass = classListFormat(DOCINFO.highClass, 0);
        DOCINFO.lowClass = (classListFormat(DOCINFO.lowClass, 0) || []);
        DOCINFO.lowDoc = classListFormat(DOCINFO.lowDoc, 2) || [];

        let contributionInfo = {
          serial: DOCINFO.serial,
          time: DOCINFO.time,
          history: DOCINFO.history,
          changedByte: DOCINFO.changedByte,
          comment: DOCINFO.comment
        }

        let keywordInfo = (DOCINFO.keyword || {});

        let linkInfo = (DOCINFO.link || {});

        let historyInfo = {
          editorFull: DOCINFO.editorFull,
          editorNick: DOCINFO.editorNick,
          time: DOCINFO.time,
          history: DOCINFO.history,
          changedByte: DOCINFO.changedByte,
          serial: DOCINFO.serial,
          comment: DOCINFO.comment
        };

        let logInfo = {
          time: DOCINFO.time,
          serial: DOCINFO.serial
        };

        //editFunctions.js 저장 완료 후에 필요
        docInfo = DOCINFO;

        console.log(DOCINFO);

        //문서의 내용이 집약된 content는 저장량을 줄이기 위해 저장하지 않는다.
        delete DOCINFO.content
        //keyword 또한 마찬가지.
        delete DOCINFO.keyword
        //lastClass 또한 마찬가지.
        delete DOCINFO.lastClass;
        //용량 줄이기
        delete DOCINFO.link;
        delete DOCINFO.type;
        delete DOCINFO.editorFull;
        delete DOCINFO.editorNick;
        delete DOCINFO.changedByte;

        console.log('start saveDoc');

        saveDoc(DOCINFO).then(() => {
          if (type != 3) {
            console.log('start saveKeyword');
            saveKeyword(keywordInfo, DOCINFO.serial).then(() => {
              console.log('start saveLink');
              saveLink(linkInfo, DOCINFO.serial).then(() => {
                console.log('start saveHistory');
                $('#logP').text(inv_serialize(DOCINFO.serial) + ' 문서의 편집 기록을 저장하는 중');
                saveHistory(historyInfo).then(() => {
                  console.log('start saveLog');
                  saveLog(logInfo).then(() => {
                    console.log('start saveContribution');
                    saveContribution(contributionInfo).then(() => {
                      console.log('start userScoreChange');
                      userScoreChange().then(() => {
                        console.log('end saveFunction');
                        resolve();
                      });
                    })
                  })
                });
              })
            })
          } else {
            resolve();
          }
        })
      });
    })
  });
}

function saveClass(DOCINFO) {
  return new Promise((resolve, reject) => {
    let docName = inv_serialize(DOCINFO.serial);
    let addedClass = DOCINFO.addedClass || [];
    let removedClass = DOCINFO.removedClass || [];

    if (docName.split(':')[0] == '분류') {
      if (docName == '분류:분류') {
        resolve();
      } else {
        addClassToClass(docName, addedClass, 0).then(() => {
          removeClassToClass(docName, removedClass, 0).then(() => {
            resolve();
          });
        });
      }
    } else {
      addDocToClass(docName, addedClass, 0).then(() => {
        removeDocToClass(docName, removedClass, 0).then(() => {
          resolve();
        });
      });
    }
  });
}

//state 0=열림, 1=숨김, 2=삭제됨
function saveDoc(newDoc) {
  return new Promise((resolve, reject) => {
    firebase.firestore().collection(String(newDoc.serial)).doc(String(newDoc.history)).set(newDoc).then(() => {
      resolve();
    });
  });
}

//시리얼 추가, USER의 변화 등을 담당.
//type == 2 => 삭제하는 중. // type == 1 => 사용자 문서 생성중 // type == 3 => 분류 변경 // type == 4 => 분류 생성
function saveEffect(newDoc, type) {
  return new Promise((resolve, reject) => {
    if ((newDoc.history == 0 || newDoc.state == 2) && type != 2) {

      //새로 만드는 문서
      newDoc.history += 1;

      //aclInfo 생성
      checkAcl(newDoc.name).then(() => {

        //시리얼 추가
        addSerial(newDoc.name, newDoc.serial).then((serial) => {

          newDoc.serial = serial;

          newDoc.state = 0;

          delete newDoc.name;

          if (type != 4) {
            //acl 저장 //시리얼보다 나중이어야 함.
            saveAcl(aclInfo, newDoc.serial).then(() => {


              userInfo.make += 1;
              userRef.child(userInfo.uid).child('make').set(userInfo.make).then(() => {
                userInfo.edit += 2;
                userRef.child(userInfo.uid).child('edit').set(userInfo.edit).then(() => {
                  if (type != 1) {
                    friendMaker(newDoc).then(() => {
                      resolve(newDoc);
                    });
                  } else {
                    //사용자 문서 생성 때는 friendMaker 작동하면 안됨.
                    //docInfo.content가 없기 때문
                    resolve(newDoc);
                  }
                })
              })
            })
          } else {
            //분류 생성이긴 한데 삭제됐던 분류는 acl을 유지해야 함.
            if (newDoc.history == 1) {
              //진짜 새로 생긴 분류 문서
              saveAcl({
                edit: 1,
                move: 50,
                delete: 50
              }, newDoc.serial).then(() => {
                resolve(newDoc);
              });
            } else {
              //삭제됐다가 생긴 문서
              resolve(newDoc);
            }
          }
        })
      });
    } else {
      //일반적인 편집
      if (type != 3) {
        //분류 변경이 아닌 경우에만 역사 +1.
        newDoc.history += 1;
      }

      if (newDoc.name != userInfo.full && (newDoc.name.search(/기:/) != -1 || newDoc.name.search(/선생님:/) != -1)) {
        //본인을 제외한 다른 학생이나 선생님을 편집한 것.
        delete newDoc.name;
        friendMaker(newDoc).then(() => {
          if (userInfo.time == 0) {
            userInfo.time = new Date().getTime();
          }
          userRef.child(userInfo.uid).child('time').set(userInfo.time + 86400000).then(() => {
            if (newDoc.changedByte < 200) {
              resolve(newDoc);
            } else {
              userInfo.edit += 1;
              userRef.child(userInfo.uid).child('edit').set(userInfo.edit).then(() => {
                resolve(newDoc);
              });
            }
          });
        });
      } else {
        delete newDoc.name;
        if (type != 3 && type != 2) {
          friendMaker(newDoc).then(() => {
            if (newDoc.changedByte < 200) {
              resolve(newDoc);
            } else {
              //분류 변경이 아닌 경우에만 기여도 상승.
              userInfo.edit += 1;
              userRef.child(userInfo.uid).child('edit').set(userInfo.edit).then(() => {
                resolve(newDoc);
              });
            }
          });
        } else {
          resolve(newDoc);
        }
      }
    }
  });
}

function saveLog(newLog) {
  return new Promise((resolve, reject) => {
    logRef.child(newLog.serial).set(newLog).then(() => {
      resolve();
    });
  });
}

function saveHistory(newHistory) {
  return new Promise((resolve, reject) => {

    firebase.database().ref('HISTORY').child(newHistory.serial).child(newHistory.history).set(newHistory).then(() => {
      resolve();
    });

  });
}

//권한 info
var aclInfo = {
  edit: 1,
  delete: 1,
  move: 1
}

function loadAcl(docSerial) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('ACL').child(docSerial).once('value', function (snap) {
      aclInfo = snap.val();
      resolve();
    });
  });
}

function checkAcl(docName) {
  return new Promise((resolve, reject) => {

    if (serialList.indexOf(docName) == -1) {
      //존재한 적이 없는 문서
      if (docName.split(':')[0] == '상상위키') {
        aclInfo = {
          edit: 50,
          delete: 50,
          move: 50
        }
      } else if (docName.split(':')[0] == '선생님' || docName.split(':')[0].search(/[0-9]+기/) != -1 || docName.split(':')[0] == '분류') {
        aclInfo = {
          edit: 1,
          delete: 50,
          move: 50 //개명할지도...
        }
      } else if (docName.split(':')[0] == '파일') {
        aclInfo = {
          edit: 1,
          delete: 1,
          move: 100
        }
      } else if (docName.split(':')[0] == '분류') {
        aclInfo = {
          edit: 1,
          delete: 100,
          move: 1
        }
      } else {
        aclInfo = {
          edit: 1,
          delete: 1,
          move: 1
        }
      }

      resolve();

    } else {
      loadAcl(serialize(docName)).then(() => {
        resolve();
      })
    }
  });
}

function saveAcl(newAcl, docSerial) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('ACL').child(docSerial).set(newAcl).then(() => {
      resolve();
    });
  });
}

function saveLink(newLink, serial) {
  return new Promise((resolve, reject) => {

    for (key in newLink) {
      newLink['/' + key + '/' + serial] = newLink[key];
      delete newLink[key];
    }

    firebase.database().ref('LINK').update(newLink).then(() => {
      resolve();
    });
  });
}

//기여 내역 저장
function saveContribution(newContribution) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('CONTRIBUTION').child(userInfo.uid).child(newContribution.time).set(newContribution).then(() => {
      resolve();
    });
  });
}

//키워드 저장
function saveKeyword(newKeyword, serial) {
  return new Promise((resolve, reject) => {
    firebase.database().ref('KEYWORD').child(serial).set(newKeyword).then(() => {
      resolve();
    });
  });
}

//삭제된 문서도 포함해서 모든 시리얼 있음. 배열 번호가 시리얼임.
var serialList = [null];

//serial = undefined면 완전 새로운 문서/ 아니면 삭제됐던 문서
function addSerial(docName, serial) {
  return new Promise((resolve, reject) => {

    console.log(serial);

    if (serial == undefined) {
      serial = serialList.length;

      serialList.push(docName);

      docNote.push(docName);
      serialNote[docName] = serial;
      inv_serialNote[serial] = docName;
    } else {
      delete removeNote[docName];
      serialNote[docName] = serial;
      inv_serialNote[serial] = docName;
      docNote.push(docName);
    }

    console.log(serial);

    $('#logP').text('문서의 시리얼 넘버를 추가하는 중');

    firebase.database().ref('SERIAL').child(serial).set({
      true: docName
    }).then(() => {
      resolve(serial);
    });

  });
}
//--------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------
//문서 삭제하기//문서 삭제하기//문서 삭제하기//문서 삭제하기//문서 삭제하기//문서 삭제하기//문서 삭제하기//문서 삭제하기
//colName = class 같이, docName = fullName 임
function deleteDoc(colName, docName) {
  return new Promise(resolve => {

    loading(true);

    console.log('type이 ' + colName + '인 ' + docName + ' 문서 제거 시작');
    $('#logP').text('시리얼 넘버를 삭제하는 중');

    if (docName == '분류:미분류') {
      console.log('분류:미분류는 삭제되지 않는다.');
      loading(false);
      resolve();
    } else {

      //시리얼에서 지운다.
      deleteSerial(docName).then(function () {

        console.log('시리얼에서 ' + docName + '을 지움');


        //최근 문서 하나를 가져옴
        firebase.firestore().collection(String(serialize(docName))).orderBy('history', 'desc').limit(1).get({
          source: 'server'
        }).then(snapshot => {

          var data = snapshot.docs[0].data();

          data.name = inv_serialize(data.serial);

          data.highClass = classListFormat(data.highClass, 1);
          data.lowClass = (classListFormat(data.lowClass, 1) || []);
          data.lowDoc = classListFormat(data.lowDoc, 3) || [];

          $('#logP').text('분류에서 문서를 삭제하는 중');

          if (colName != 'class') {
            //분류문서가 아니라면
            //제거된 문서를 새로 저장함.
            removeDocToClass(docName, data.highClass, 0).then(() => {
              console.log('분류에서 제거 완료');
              deleteDocument(data).then(() => {
                //로그에서 지운다.
                console.log('지워진 문서 추가 완료');

                $('#logP').text('문서의 편집 기록을 삭제하는 중');

                deleteLog(docName).then(function () {

                  $('#logP').text('문서 삭제 성공');

                  console.log('로그에서 ' + docName + '을 지움');
                  console.log(docName + ' 완전히 제거 성공');
                  resolve();
                });
              });
            });
          } else {
            //분류문서라면 => 이미 상위, 하위 다 지워진 상태라 콘텐츠만 수정하면 됨.(강제 제거는 불가능하니까)
            deleteDocument(data).then(() => {

              //로그에서 지운다.
              $('#logP').text('문서의 편집 기록을 삭제하는 중');

              deleteLog(docName).then(function () {

                $('#logP').text('문서 삭제 성공');

                console.log('로그에서 ' + docName + '을 지움');
                console.log(docName + ' 완전히 제거 성공');
                loading(false);
                resolve();
              });
            })
          }
        });
      });
    }
  });
}



//로그에서 지우기
function deleteLog(docName) {
  return new Promise(resolve => {
    logRef.child(serialize(docName)).remove().then(function () {
      resolve();
    });
  });
}

//시리얼에서 지우기
function deleteSerial(docName) {
  return new Promise(resolve => {
    firebase.database().ref('SERIAL').child(serialize(docName)).set({
      false: docName
    }).then(() => {
      resolve();
    });
  });
}


function deleteDocument(info) {
  return new Promise(resolve => {

    var lastDocInfo = info;

    lastDocInfo.editorFull = userInfo.full;
    lastDocInfo.editorNick = userInfo.nick;
    lastDocInfo.document = {
      content: ''
    };
    lastDocInfo.state = 2;
    lastDocInfo.time = new Date().getTime();
    lastDocInfo.changedByte = -lastDocInfo.byte;
    lastDocInfo.byte = 0;
    lastDocInfo.comment = '문서 삭제';
    lastDocInfo.link = {};
    lastDocInfo.keyword = {};
    lastDocInfo.highClass = [];
    lastDocInfo.lowClass = [];
    lastDocInfo.lowDoc = [];

    if (inv_serialize(lastDocInfo.serial).split(':')[0] == '파일') {
      lastDocInfo.link = {
        ['/' + encode(inv_serialize(lastDocInfo.serial)) + '/' + lastDocInfo.serial]: null
      };
    }

    console.log(lastDocInfo);

    delete serialNote[lastDocInfo.name];
    delete inv_serialNote[lastDocInfo.serial];
    docNote.splice(docNote.indexOf(lastDocInfo.name), 1);
    removeNote[lastDocInfo.name] = lastDocInfo.serial;

    saveFunction(lastDocInfo, 2).then(() => {

      if (inv_serialize(lastDocInfo.serial).split(':')[0] == '파일') {
        fstorage.child('image/' + inv_serialize(lastDocInfo.serial).split(':').slice(1).join(':')).delete().then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    })
  });
}


//수정된 문서//수정된 문서//수정된 문서//수정된 문서//수정된 문서//수정된 문서//수정된 문서//수정된 문서//수정된 문서//수정된 문서
const logRef = firebase.database().ref('LOG');
var logList = [];
var logObj = {};

//로그가 없어지거나 추가되거나 변경될 때마다 동작.
function startLogListener() {

  logRef.orderByChild('time').on('child_changed', function (snap) {
    //console.log(snap.val());
    changeLog(snap);
  });

  logRef.orderByChild('time').limitToLast(12).on('child_added', function (snap) {
    // console.log('newLog!!');
    // console.log(snap.val());
    //새로 추가된 문서 이름은 모르기 때문에 가져와야 함.
    getSerial().then(() => {
      addNewLog(snap);
    })
  });

  logRef.orderByChild('time').on('child_removed', function (snap) {
    //console.log(snap.val());
    removeLog(snap);
  });
}

function getSerial() {
  return new Promise((resolve, reject) => {
    firebase.database().ref('SERIAL').orderByKey().once('value', function (serialData) {

      docNote = [];
      serialList = [null];

      serialData.forEach(value => {
        //console.log(value.val());
        if (value.val().true != undefined) {
          serialNote[value.val().true] = Number(value.key);
          inv_serialNote[Number(value.key)] = value.val().true;
          docNote.push(value.val().true);

          serialList.push(value.val().true);
        } else {
          removeNote[value.val().false] = Number(value.key);

          serialList.push(value.val().false);
        }
      });

      resolve();
    });
  });
}

function showLog() {

  logList.sort(function (a, b) {
    if (a.time < b.time) {
      return 1;
    } else if (a.time > b.time) {
      return -1;
    } else {
      if (a.serial > b.serial) {
        return -1;
      } else {
        return 1;
      }
    }
  })

  // console.log('showLog!');
  // console.log(logList[0]);

  $('#logDiv').empty();

  $('#logDiv').append("<p>수정된 문서</p><hr>");

  let logNameList = [];

  let loopCount = 0;
  logList.forEach(function (log) {
    var dt = new Date(log.time);
    var logDocName = inv_serialize(log.serial);
    if (loopCount < 12 && logNameList.indexOf(logDocName) == -1) {
      loopCount++;
      logNameList.push(logDocName);
      $('#logDiv').append('<div class="container"><a href="w/' + logDocName + '">' +
        logDocName + '</a><p>' + dt.getHours() + ':' + dt.getMinutes() + '</p></div><hr>');

    }
  });

  addAnchorEventListener();
}

function removeLog(snap) {

  let removeIndex;
  logList.forEach(function (log, index) {
    if (log.serial == snap.val().serial) {
      removeIndex = index;
    }
  });

  console.log(removeIndex);
  console.log(logList);
  console.log(logList[removeIndex]);

  console.log(logList.splice(removeIndex, 1));

  showLog();
}

function addNewLog(snap) {

  logList.splice(0, 0, snap.val());
  showLog();

}

function changeLog(snap) {

  logList.forEach(function (log, index) {
    if (log.serial == snap.val().serial) {
      logList.splice(index, 1);
    }
  });

  logList.splice(0, 0, snap.val());

  showLog();
}

//const rankRef = firebase.database().ref('RANK');
//기여도 순위
function loadRank() {

  $('#rankDiv').empty();
  $('#rankDiv').append('<p>기여도 순위</p>\n<hr>');
  userRef.orderByChild('edit').limitToLast(7).once('value', function (data) {
    var editCount = new Array();
    var editName = new Array();
    data.forEach(function (val) {
      editName.push(val.val().nick);
      editCount.push(val.val().edit);
    });
    //console.log(editName);
    for (var i = editName.length - 1; i > -1; i--) {
      $('#rankDiv').append('<div class="container"><p>' + editName[i] + ' : ' + editCount[i] + '</p></div><hr>');
    }
  });
}

//문서 이동 함수
function moveDoc(oldDocName, newDocName) {
  return new Promise((resolve, reject) => {
    //시리얼만 수정하면 문서 이동이 완료된다!

    firebase.database().ref('SERIAL').child(serialize(oldDocName)).set({
      true: newDocName
    }).then(() => {
      resolve();
    });
  });
}

function getDocName() {

  let url = decodeURI(location.pathname);
  url = url.split('/');

  let docName = url.slice(2).join('/');

  let question = location.search.substring(1);

  if (question.split('&')[0] == 'doc=.') {
    question = question.split('&').slice(1).join('&');
    docName = '.';
  }

  return docName;
}

function getPageType() {
  let url = decodeURI(location.pathname);
  url = url.split('/');
  return url[1];
}