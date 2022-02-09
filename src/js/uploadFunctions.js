//파일 업로드 파일 업로드 파일 업로드 파일 업로드 파일 업로드 파일 업로드 파일 업로드 파일 업로드 파일 업로드

const fstorage = firebase.storage().ref();
var storageRef;
var imageData = undefined;

function loadUploadInterface() {

    $('#uploadContentTextarea').val(`[#파일#]

=] 파일 정보
]출처||출처를 입력해 주세요.
]저작자||저작자를 입력해 주세요.
]저작권||저작권 또는 라이선스를 입력해 주세요.
]기타||기타 정보가 있으면 입력해 주세요.];

=] 파일 설명
파일에 관한 설명을 작성해 주세요.`)
}

/* 이미지 사이즈 조절 함수인데 그러면 화질 떨어져서 어쩔 수 없이 최대 화질로 저장 => 이 함수는 필요 x
function imageSizeChange(file) {
    return new Promise(resolve => {
        var reader = new FileReader();
        reader.onloadend = function () {

            var tempImg = new Image();
            tempImg.src = reader.result;
            tempImg.onload = function () {

                var MAX_WIDTH = 1000;
                var MAX_HEIGHT = 1000;
                var tempW = tempImg.width;
                var tempH = tempImg.height;

                //비율로 사이즈 맞추기
                if (tempW > tempH) {
                    if (tempW > MAX_WIDTH) {
                        tempH *= MAX_WIDTH / tempW;
                        tempW = MAX_WIDTH;
                    }
                } else {
                    if (tempH > MAX_HEIGHT) {
                        tempW *= MAX_HEIGHT / tempH;
                        tempH = MAX_HEIGHT;
                    }
                }

                //그냥 사이즈 맞추기
                // tempW = MAX_WIDTH;
                // tempH = MAX_HEIGHT;

                var canvas = document.createElement('canvas');
                canvas.width = tempW;
                canvas.height = tempH;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0, tempW, tempH);
                var dataURL = canvas.toDataURL("image/jpeg");
                resolve(dataURL);
            }
        }
        reader.readAsDataURL(file);
    });
}*/

var imageName;

function changeImage(images) {
    console.log(images[0]);
    if (images[0].type.split('/')[0] != 'image') {
        alert('이미지를 선택해 주세요!\n(.jpg .png .gif 등)');
    } else {
        imageData = images[0];
        $('#fileNameP').text(imageData.name);
        imageName = imageData.name;
    }
}


function checkImage() {

    if (imageData != undefined) {

        if (confirm(imageData.name + " 이미지를 업로드 하시겠습니까?")) {


            var isNew = true;


            if (serialNote['파일:' + imageName] != undefined) {
                isNew = false;
            }

            if (!isNew) {

                alert('이름이 같은 파일이 존재합니다.');
                history.go(0);


            } else {

                uploadImage();
            }
        }
    }
}

function uploadImage() {

    $('#logP').text('이미지를 저장하는 중');

    loading(true);

    //이미지 용량 줄이기
    //imageSizeChange(imageData).then(dataURL => {

    //용량 줄인 뒤 이미지 추가하는 방법
    //fstorage.child('img/' + imageName).putString(dataURL, 'data_url').then(function () {

    var imageInfo = {};

    fstorage.child('image/' + imageName).put(imageData).then(function () {
        //바이트 체크
        imageInfo.content = "[{" + imageName + "}]\nsize:" + imageData.size + '\n' +
            $('#uploadContentTextarea').val();
        imageInfo.byte = getByteLength(imageInfo.content);
        imageInfo.changedByte = imageInfo.byte;
        imageInfo.name = '파일:' + imageName;
        imageInfo.editorNick = userInfo.nick;
        imageInfo.editorFull = userInfo.full;
        imageInfo.lowClass = [];
        imageInfo.lowDoc = [];
        imageInfo.link = {};

        grammar('save', imageInfo).then((imageInfo2) => {

            mainGrammar('make', imageInfo2).then((imageInfo3) => {
                //변한 분류들 수정
                mainGrammar('save', imageInfo3).then((imageInfo4) => {

                    imageInfo = imageInfo4;

                    addKeyword(imageInfo.name);

                    docInfo.keyword = keywordObject;

                    let isRemove = false;
                    if (removeNote[imageInfo.name] != undefined) {
                        isRemove = true;
                    }

                    //문서 생성으로 취급되어 오르기 때문에 미리 깎아둔다.
                    userInfo.edit -= 2;
                    userInfo.make -= 1;


                    if (isRemove) {
                        //삭제됐던 파일이면
                        firebase.firestore().collection(String(serialize(imageInfo.name))).orderBy('history', 'desc').limit(1).get({
                            source: 'server'
                        }).then(field => {
                            let lastImageInfo = field.docs[0].data();

                            imageInfo.state = 2;
                            imageInfo.serial = lastImageInfo.serial;
                            imageInfo.time = new Date().getTime();
                            imageInfo.history = lastImageInfo.history;
                            imageInfo.comment = '업로드';

                            saveFunction(imageInfo).then(() => {
                                alert(imageName + ' 파일이 정상적으로 업로드 되었습니다.');
                                loading(false);
                                movePage('파일:' + imageName, '', '', 'w');
                            });
                        });
                    } else {
                        //완전 새로운 파일

                        imageInfo.history = 0;
                        imageInfo.comment = '';
                        imageInfo.state = 0;
                        imageInfo.time = new Date().getTime();
                        saveFunction(imageInfo).then(() => {
                            alert(imageName + ' 파일이 정상적으로 업로드 되었습니다.');
                            loading(false);
                            movePage('파일:' + imageName, '', '', 'w');
                        });
                    }
                });
            });
        });
    });
}