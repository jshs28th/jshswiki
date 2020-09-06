var u = decodeURI(document.URL.split('/').pop()).replace(/&DOT&/, '.');

var logList;

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
console.log(decodeURI(document.URL.split('/').pop()))
$('#searchTxt').val(decodeURI(document.URL.split('/').pop()));

search();

function search() {
    firebase.database().ref('SERIAL').once('value', function (happySerial) {
        serialNote = happySerial.val()
    
        autoDocList = [];
    
        happySerial.forEach(value => {
            autoDocList.push(value.key.replace(/&DOT&/g, '.'));
        });
    
        searchMaker().then(searchedDocumentList => {
    
            firebase.database().ref('LOG').once('value', function (snap) {
                logList = snap.val();
                console.log(logList);
                $("article").empty();
                for (var i = 0; i < searchedDocumentList.length; i++) {
                    console.log(inv_serialize(searchedDocumentList[i][0]));
                    var log = logList[inv_serialize(searchedDocumentList[i][0])];
                    //console.log(log);
                    var time = new Date(log.time);
                    $("article").append("<a href='../w/" + inv_serialize(searchedDocumentList[i][0]).replace(/&DOT&/g, '.') + "'>" +
                        inv_serialize(searchedDocumentList[i][0]).replace(/&DOT&/g, '.') + "최종 수정: " + time.getFullYear() +
                        "/" + (time.getMonth()+1) + "/" + time.getDate() + " " + time.getHours() +
                        ":" + time.getMinutes() +"</a>")
                }
    
                loading(false);
            });
        });
    });
}



//검색엔쥔
function searchMaker() {
    return new Promise(resolve => {


        function matrixProductMatrix(matrix1, matrix2) { //행렬곱
            if (matrix1[0].length == matrix2.length) {
                var resultMatrix = new Array(matrix1[0].length);
                for (var i = 0; i < matrix1[0].length; i++) {
                    resultMatrix[i] = new Array(matrix2.length);
                }

                for (var i = 0; i < matrix1[0].length; i++) {
                    for (var j = 0; j < matrix2.length; j++) {
                        var sumOfCalcul = 0;
                        for (var k = 0; k < matrix1[0].length; k++) {
                            sumOfCalcul += matrix1[i][k] * matrix2[k][j]
                        }
                        resultMatrix[i][j] = sumOfCalcul;
                    }
                }
                return resultMatrix;
            } else {
                return [];
            }

        }

        function matrixProductVector(matrix, vector) { //행렬과 벡터 곱셈
            if (matrix[0].length == vector.length) {
                var resultMatrix = new Array(matrix[0].length);
                for (var i = 0; i < matrix[0].length; i++) {
                    var sumOfCalcul = 0;
                    for (var k = 0; k < matrix[0].length; k++) {
                        sumOfCalcul += matrix[i][k] * vector[k]
                    }
                    resultMatrix[i] = sumOfCalcul;
                }
                return resultMatrix;
            } else {
                return [];
            }
        }

        function vectorNomalization(vector) { //벡터 표준화
            var vectorSize = 0;
            for (var i = 0; i < vector.length; i++) {
                vectorSize += vector[i] ** 2;
            }
            for (var i = 0; i < vector.length; i++) {
                vector[i] = vector[i] / (vectorSize ** 0.5);
            }
            return vector
        }


        var relship;
        firebase.database().ref('RELATIONSHIP').once('value', function (snap) {
            relship = snap.val();
        }).then(() => {
            var searchedTxt = $("#searchTxt").val();
            if (searchedTxt != "") {

                var searchedTxtList = searchedTxt.split(/(?:<|>| |\(|\)|\[|\]|{|}|\||\.|\/|#|\$|:|\?|,)/g);
                var searchedTxtSet = new Set()
                for (var i = 0; i < searchedTxtList.length; i++) {
                    searchedTxtSet.add(searchedTxt);
                }
                var searchedTxtList = [...searchedTxtSet].sort();
                console.log(searchedTxtList)
            } else {
                alert("검색어를 입력해 주세요.")
                return;
            } //검색어 받아옴
            var keywordObject = new Object(); //키워드 리스트 받아올 거
            var searchedObject = new Object();
            firebase.database().ref('KEYWORD').once('value', function (snap) {
                keywordObject = snap.val()
                for (key in keywordObject) {
                    var temptkey = key;
                    searchedObject[temptkey] = 0
                    for (key in keywordObject[temptkey]) {

                        for (var i = 0; i < searchedTxtList.length; i++) {
                            if (key == searchedTxtList[i]) {
                                searchedObject[temptkey] += keywordObject[temptkey][key]
                            }
                        }

                    }
                    if (searchedObject[temptkey] == 0) {
                        delete searchedObject[temptkey]
                    }
                }

            }).then(() => {
                
                //console.log(searchedObject) //{문서의 시리얼: 검색어를 가지고 있는 개수, 시리얼: 개수, .....} 요렇게 나오면 됨
                var totalList = new Set(); //검색된 문서와 연관된 문서(검색어를 포함하든 안하든)를 다 모음 중복 없이
                var addedList = new Set(); //검색어가 없는 문서지만 연관된 문서 즉 새롭게 추가될 문서들만 모음
                for (searchedDoc in searchedObject) {
                    totalList.add(String(searchedDoc));
                    for (relatedDoc in relship[searchedDoc]) {
                        totalList.add(String(relatedDoc))

                        if (searchedObject[relatedDoc] == undefined) {
                            addedList.add(String(relatedDoc))
                        }
                    }
                }
                if (totalList.size == 0){
                    return ; 
                }else{
                    var addedRealList = [...addedList].sort(); // addedList를 Set그대로 쓰려니 오류가 생겨서 List로 바꿔줌
                    var totalRealList = [...totalList].sort(); // 얘도 위와 같은 이유
                    for (var i = 0; i < addedRealList.length; i++) {
                        searchedObject[addedRealList[i]] = 0.01
                    }
                    var relMatrix = new Array(totalRealList.length); // nXn 인접행렬 생성
                    for (var i = 0; i < relMatrix.length; i++) {
                        relMatrix[i] = new Array(totalRealList.length);
                    }
                    console.log("ready!!")
                    console.log(totalRealList);
                    for (var i = 0; i < totalRealList.length; i++) {
                        for (var j = 0; j < totalRealList.length; j++) {
                            if (i == j) {
                                relMatrix[j][i] = 0
                            } else {
                                if (relship[totalRealList[i]] == undefined) {
                                    relMatrix[j][i] = 0
                                } else {
                                    if (relship[totalRealList[i]][totalRealList[j]] == undefined) {
                                        relMatrix[j][i] = 0
                                    } else {
                                        relMatrix[j][i] = ((relship[totalRealList[i]][totalRealList[j]]["tot_fdp"] + relship[totalRealList[i]][totalRealList[j]]["std_fdp"]) * (1 - 1.2 ** (-searchedObject[totalRealList[j]] * searchedObject[totalRealList[i]])))
                                    }
                                }
                            }
                        }
    
                    }
                    //console.log(relMatrix)//인접행렬 만듬
                    var gen_relMatrix = new Array(totalRealList.length); //열정규화 작업
                    for (var i = 0; i < gen_relMatrix.length; i++) {
                        gen_relMatrix[i] = new Array(totalRealList.length);
                    }
                    for (var i = 0; i < totalRealList.length; i++) {
                        var column_sum = 0;
                        for (var j = 0; j < totalRealList.length; j++) {
                            column_sum += relMatrix[j][i];
                        }
                        for (var j = 0; j < totalRealList.length; j++) {
                            if (relMatrix[j][i] != 0) {
                                if (addedList.has(totalRealList[i]) == true) {
                                    gen_relMatrix[j][i] = (relMatrix[j][i]) // Math.log(2 + column_sum)) * (0.1);
                                } else {
                                    gen_relMatrix[j][i] = (relMatrix[j][i]) // Math.log(2 + column_sum));
                                }
    
                            } else {
                                gen_relMatrix[j][i] = 0.001 * 1.747565 / totalRealList.length
                            }
                        }
                    }
                    //console.log(gen_relMatrix)//정규화됨!! 초기에 검색되지 않았던 문서의 열 합과 검색된 문서의 합의 비율이 0.577과 1이다. 0.577은 오일러 마스케로니 상수이다 1.747565는 NaCl의 마델룽 상수이다
                    var gen_relMatrix_T = new Array(totalRealList.length); // 완성된 인접행렬의 전치행렬
    
                    for (var i = 0; i < gen_relMatrix.length; i++) {
                        gen_relMatrix_T[i] = new Array(totalRealList.length);
                    }
                    for (var i = 0; i < totalRealList.length; i++) {
                        for (var j = 0; j < totalRealList.length; j++) {
                            gen_relMatrix_T[i][j] = gen_relMatrix[j][i]
                        }
                    }
                    //console.log(gen_relMatrix, gen_relMatrix_T)//테스트 완료
    
                    var authorityVector = new Array(gen_relMatrix.length);
                    for (var i = 0; i < gen_relMatrix.length; i++) {
                        var row_sum = 0;
                        for (var j = 0; j < gen_relMatrix.length; j++) {
                            row_sum += gen_relMatrix[i][j];
                        }
                        authorityVector[i] = row_sum
                    }
                    
    
                    var calculationMatrix = matrixProductMatrix(gen_relMatrix, gen_relMatrix_T);
    
                    for (var i = 0; i < 800 * Math.log(2 + gen_relMatrix.length); i++) {
                        authorityVector = vectorNomalization(matrixProductVector(calculationMatrix, authorityVector))
                    }
    
                    var resultList = new Array(gen_relMatrix.length)
                    for (var i = 0; i < gen_relMatrix.length; i++) {
                        resultList[i] = [totalRealList[i], authorityVector[i]]
                    }
                    for (var i = 0; i < gen_relMatrix.length; i++) {
                        for (var j = 1; j < gen_relMatrix.length - i; j++) {
                            if (resultList[j][1] > resultList[j - 1][1]) {
                                temp = resultList[j - 1];
                                resultList[j - 1] = resultList[j];
                                resultList[j] = temp;
                            }
                        }
                    }
                    console.log(resultList)
                    resolve(resultList); //이게 결과 리스트 [[씨리얼,중요도],[씨리얼,중요도],....] 이렇게 나온다. 조원희 일해라
                }

            })
        });
    });
}