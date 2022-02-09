function backup () {
    checkLevel().then(() => {
        if(userInfo.level >= 50) {
            getSerial().then(() => {
                backupLoop(1, new Date().getTime()).then(() => {
                    console.log('백업이 완료되었습니다.');
                })
            })
        } else {
            console.log('권한이 부족합니다.');
        }
    })
}

function backupLoop(num, time) {
    return new Promise((resolve, reject) => {
        
        firebase.firestore().collection(String(num)).orderBy('history', 'desc').limit(1).get().then(snap => {
            // console.log(snap)
            if (snap.empty) {
                resolve();
            } else {
                console.log(inv_serialize(num));

                let _info = snap.docs[0].data();

                _info.highClass = classListFormat(_info.highClass, 1);
                _info.lowClass = classListFormat(_info.lowClass, 1) || [];
                _info.lowDoc = classListFormat(_info.lowDoc, 3) || [];

                mainGrammar('edit', _info).then(info => {
                    let content = info.content.replace(/&lt;/g, '<');
                    $.post('/alpha/backup/backup.php', {
                        time: time,
                        serial: num,
                        name: inv_serialize(num),
                        content: content
                    }, function (val, status) {

                        if (status == 'success') {
                            backupLoop(num + 1, time).then(() => {
                                resolve();
                            })
                        }
                    });
                })
            }
        })
    });
}