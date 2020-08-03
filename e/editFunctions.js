$("#exitBtn").off('click').on('click', function () {

    if (confirm("편집을 취소하시겠습니까?")) {
        reasonOfMove = '취소';
        location.href = "../w/" + $("#titleH1").text().replace(/ /gi, "%20");
    }
});

$('#grammarBtn').on('click', function () {

    var helpNum = prompt('1. 글자서식\n2. 하이퍼링크\n3. 사진 및 그림\n4. 목차\n5. 리스트\n6. 표\n7. 각주\n8. 분류\n9. 인용문\n10. 수식\n11. 틀과 카드\n12. 기타');

    if (helpNum == 1) {

        alert('["굵게"]\n[/기울임/]\n[\'밑줄\']\n[_취소선_]\n[+위첨자+]\n[-아래첨자-]\n[?css문법|내용?] => 자세한 내용은 "전곽위키:문법"을 참고하세요');

    } else if (helpNum == 2) {

        alert('[[문서이름]] 또는 [[문서이름|보여줄 이름]]\n일반적인 링크도 가능합니다.' +
            +'\n[[https://www.naver.com]]\n특정 문단에 링크를 거는 법\n[[문서이름#index_1_2_]] --> 문서의 1.2.번째 목차' +
            +'\n학생이나 선생님, 동아리 문서는 [[문서이름]]만 적어도 괄호 부분이 삭제된 채로 출력됩니다.');

    } else if (helpNum == 3) {

        alert('[{사진이름.확장자}]\n사진을 업로드 한 후에 사용 가능합니다.');

    } else if (helpNum == 4) {

        alert('[=1단계=]\n[==2단계==]\n[===3단계===]\n[====4단계====]');

    } else if (helpNum == 5) {

        alert('순서 있는 리스트\n:{내용1}{내용2}{내용3}:\n순서 없는 리스트\n:(내용1)(내용2)(내용3):');

    } else if (helpNum == 6) {

        alert(':[]:안에 ][로 행을 구분하고 ||로 열을 구분합니다.\n좌표로 쓴 예시\n:[1,1||1,2||1,3][2,1||2,2||2,3][3,1||3,2||3,3]:' +
            '\n\n각 칸의 왼쪽에 "숫자]"를 넣으면 오른쪽 가로방향으로 숫자만큼의 칸이 합쳐집니다.' +
            '\n각 칸의 오른쪽에 "[숫자"를 넣으면 아래쪽 세로방향으로 숫자만큼의 칸이 합쳐집니다.' +
            '\n가로로 2칸 세로로 3칸을 합치고 싶으면 "2]내용내용[3"과 같이 사용합니다.' +
            '\n자세한 내용은 "전곽위키:문법"의 "2.6.표"를 참고하세요.');

    } else if (helpNum == 7) {

        alert('{{각주내용}}');

    } else if (helpNum == 8) {

        alert('[#분류이름#]\n한 문서에 여러 분류를 적용할 수 있습니다.\n*분류문법은 문서 맨 위에 사용하는 것을 권장합니다!*');

    } else if (helpNum == 9) {

        alert('[>1단계<]\n[>>2단계<<]\n[>>>3단계<<<]');

    } else if (helpNum == 10) {

        alert('[math(LaTeX문법)]\n문장 사이에 넣을 수 있습니다.\n[Math(LaTeX문법)]\n문장 사이에 넣지 못하며 가운데 정렬 됩니다.');

    } else if (helpNum == 11) {

        alert('[틀(틀 이름)]\n틀 이름은 "틀:"을 제외한 이름입니다.\n[카드(색|내용)]\n색 부분에 CSS문법을 적용할 수 있습니다. 단, "색;"을 먼저 적어야 합니다.');

    } else if (helpNum == 12) {

        alert('수평선(구분선) => ---\n들여쓰기 => :]\n컴퓨터 코드 => [code(코드)]\n넘겨주기 => [넘겨주기(문서 이름)]\n엔터는 자동으로 적용됩니다.\n\\는 문법이 적용되지 않게 해 줍니다. 예) \\["그대로"]');

    } else if (helpNum == 13) {

        alert('dltmxjdprm1');

    }
});

//문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!
//문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!
//문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!
//문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!

//0은 불러오기 \n 사용
//1은 저장하기 \n 사용
var newTxt = '';
//링크 문법
function ankerGrammar(text, num) {
    return new Promise(resolve => {
        if (num == 0) {
            newTxt = text.replace(/<a title='((?:.|\n)+?)' href='.+?'>((?:.|\n)+?)<\/a>/g, function (match, first, second) {
                if (first != second) {

                    if (first.search(/(?:.|\n)+?\([0-9]+?기\)/) != -1) {
                        if (second == first.split(/\([0-9]+?기\)/)[0]) {
                            return "[[" + first + "]]";
                        } else {
                            return "[[" + first + "|" + second + "]]";
                        }

                    } else if (first.search(/(?:.|\n)+?\(동아리\)/) != -1) {
                        if (second == first.split(/\(동아리\)/)[0]) {
                            return "[[" + first + "]]";
                        } else {
                            return "[[" + first + "|" + second + "]]";
                        }

                    } else if (first.search(/(?:.|\n)+?\(선생님\)/) != -1) {
                        if (second == first.split(/\(선생님\)/)[0] + ' 선생님') {
                            return "[[" + first + "]]";
                        } else {
                            return "[[" + first + "|" + second + "]]";
                        }

                    } else {
                        return "[[" + first + "|" + second + "]]";
                    }
                } else {

                    return "[[" + first + "]]";

                }
            });
        } else if (num == 1) {
            newTxt = text.replace(/(?<!\\)(?<!])\[\[([^\[](?:}]|[^|])*?)]]/g, function (match, first) {



                if (first.search(/(?:.|\n)+?\([0-9]+?기\)/) != -1 || first.search(/(?:.|\n)+?\(동아리\)/) != -1) {
                    addKeyword(first.split('(')[0]);
                    return "<a title='" + first + "' href='" + first + "'>" + first.split('(')[0] + "</a>";
                } else if (first.search(/(?:.|\n)+?\(선생님\)/) != -1) {
                    addKeyword(first.split('(')[0]);
                    return "<a title='" + first + "' href='" + first + "'>" + first.split('(')[0] + " 선생님</a>";
                } else {
                    addKeyword(first);
                    return "<a title='" + first + "' href='" + first + "'>" + first + "</a>";
                }
            });
            //console.log('ok');
            newTxt = newTxt.replace(/(?<!\\)\[\[((?:[^|[](?!]]))+?)\|((?:[^\]](?!\[\[)(?!]]])|}]|\)])+?)]]/g, function (match, first, second) {
                addKeyword(second);
                return "<a title='" + first + "' href='" + first + "'>" + second + "</a>"
            });
            //console.log('ok2');
        }

        resolve(newTxt);
    });
}

//글자 서식 문법
function textGrammar(text, num) {
    return new Promise(resolve => {
        if (num == 0) {
            newTxt = text.replace(/<b>((?:.|\n)+?)<\/b>/g, "[\"$1\"]");
            newTxt = newTxt.replace(/<i>((?:.|\n)+?)<\/i>/g, "[/$1/]");
            newTxt = newTxt.replace(/<ins>((?:.|\n)+?)<\/ins>/g, "['$1']");
            newTxt = newTxt.replace(/<del>((?:.|\n)+?)<\/del>/g, "[_$1_]");
            newTxt = newTxt.replace(/<sup>((?:.|\n)+?)<\/sup>/g, "[+$1+]");
            newTxt = newTxt.replace(/<sub>((?:.|\n)+?)<\/sub>/g, "[-$1-]");
        } else if (num == 1) {
            newTxt = text.replace(/(?<!\\)\[\/((?:.|\n)+?)\/]/g, "<i>$1</i>");
            newTxt = newTxt.replace(/(?<!\\)\['((?:.|\n)+?)']/g, "<ins>$1</ins>");
            newTxt = newTxt.replace(/(?<!\\)\[_((?:.|\n)+?)_]/g, "<del>$1</del>");
            newTxt = newTxt.replace(/(?<!\\)\["((?:.|\n)+?)"]/g, function (match, first) {
                addKeyword(first);
                return "<b>" + first + "</b>";
            });
            newTxt = newTxt.replace(/(?<!\\)\[\+((?:.|\n)+?)\+]/g, "<sup>$1</sup>");
            newTxt = newTxt.replace(/(?<!\\)\[\-((?:.|\n)+?)\-]/g, "<sub>$1</sub>");
        }

        resolve(newTxt);
    });
}

//기타 문법
//들여쓰기, 취소선
function gitaGrammar(text, num) {
    return new Promise(resolve => {
        if (num == 0) {
            newTxt = text.replace(/<hr>/g, "---\n");
            newTxt = newTxt.replace(/&nbsp&nbsp&nbsp&nbsp/g, ":]");
        } else if (num == 1) {
            newTxt = text.replace(/(?<!\\)---(?:\n)?/g, "<hr>");
            newTxt = newTxt.replace(/(?<!\\):](?:(?!:)|(?=:]))/g, "&nbsp&nbsp&nbsp&nbsp");
        }

        resolve(newTxt);
    });
}

//span 문법
function spanGrammar(text, num) {
    return new Promise(resolve => {
        if (num == 0) {
            newTxt = text.replace(/<span style='(.+?)'>((?:.|\n)+?)<\/span>/g, "[?$1|$2?]");
        } else if (num == 1) {
            newTxt = text.replace(/(?<!\\)\[\?(.+?)\|((?:.|\n)+?)\?]/g, function (match, first, second) {
                addKeyword(second);
                return "<span style='" + first + "'>" + second + "</span>"
            });
        }

        resolve(newTxt);
    });
}

//display = block 인 문법들
function blockGrammar(text, num) {
    return new Promise(resolve => {
        if (num == 0) {
            //console.log(text);
            if (text.search(/<table><tr><(?:.(?!<table>)(?!<ol>)(?!<ul)|\n)+?<\/td><\/tr><\/table>/) != -1) {
                //console.log('table');
                tableGrammar(text, 0).then(text => {
                    blockGrammar(text, num).then(text => {
                        resolve(text);
                    });
                });

            } else if (text.search(/<ul style='list-style: disc !important'><li>(?:.(?!<table>)(?!<ol>)(?!<ul)|\n)+?<\/li><\/ul>/) != -1) {
                //console.log('unList');
                unListGrammar(text, 0).then(text => {
                    blockGrammar(text, num).then(text => {
                        resolve(text);
                    });
                });

            } else if (text.search(/<ol><li>(?:.(?!<table>)(?!<ol>)(?!<ul)|\n)+?<\/li><\/ol>/) != -1) {
                //console.log('orList');
                orListGrammar(text, 0).then(text => {
                    blockGrammar(text, num).then(text => {
                        resolve(text);
                    });
                });

            } else {
                resolve(text);
            }

        } else if (num == 1) {
            //console.log(text);
            if (text.search(/\n?(?<!\\):\[(?:[^:]|\n|:(?!\(|\{|\[)|\\:)+?\]:/) != -1) {
                //console.log('table');
                tableGrammar(text, 1).then(text => {
                    blockGrammar(text, num).then(text => {
                        resolve(text);
                    });
                });

            } else if (text.search(/\n?(?<!\\):\((?:[^:]|\n|:(?!\(|\{|\[)|\\:)+?\):/) != -1) {
                //console.log('unList');
                unListGrammar(text, 1).then(text => {
                    blockGrammar(text, num).then(text => {
                        resolve(text);
                    });
                });

            } else if (text.search(/\n?(?<!\\):\{(?:[^:]|\n|:(?!\(|\{|\[)|\\:)+?\}:/) != -1) {
                //console.log('orList');
                orListGrammar(text, 1).then(text => {
                    blockGrammar(text, num).then(text => {
                        resolve(text);
                    });
                });

            } else {
                resolve(text);
            }
        }
    });
}

//테이블(표) 문법
function tableGrammar(text, num) {
    return new Promise(resolve => {

        var reg1;
        var reg2;
        var reg3;
        var t1;
        var t2;
        var c1;
        var c5;
        var c6;
        var c7;


        //:[세로로 합칠 개수]칸1[가로로 합칠 개수||가로로 합칠 개수]칸2[세로로 합칠 개수]:
        if (num == 0) {

            reg1 = /<table><tr><((?:.(?!<table>)(?!<ol>)(?!<ul)|\n)+?)<\/td><\/tr><\/table>(<\/li>|<\/td>)?/g;
            reg2 = /td colspan='([0-9]+?)' rowspan='([0-9]+?)'>((?:.|\n)+)/;
            reg3 = /<table><tr><((?:.(?!<table>)(?!<ol>)(?!<ul)|\n)+?)<\/td><\/tr><\/table>(<\/li>|<\/td>)?/;
            //자를 때
            t1 = '</td><';
            t2 = '</td></tr><tr><';
            //붙일 때
            c1 = "||";
            c5 = "\n][";
            c6 = ":[";
            c7 = "\n]:";

        } else if (num == 1) {

            reg1 = /(?<!\\):\[((?:[^:]|\n|:(?!\(|\{|\[)|\\:)+?)\n?\]:\n?/g;
            reg2 = /^(?:([0-9]+?)\])?((?:.|\n)+?)(?:\[([0-9]+?))?$/;
            reg3 = /(?<!\\):\[((?:[^:]|\n|:(?!\(|\{|\[)|\\:)+?)\n?\]:\n?/;
            //자를 때
            t1 = '||';
            t2 = /\n(?:(?<!\])|(?<=\]\]))(?:(?<!})|(?<=}}))]\[(?:(?!\[)|(?=\[\[)|(?=\[.+?\())(?:(?!{)|(?={{))/;
            //붙일 때
            c1 = "";
            c5 = "</tr><tr>";
            c6 = "<table><tr>";
            c7 = "</tr></table>";
        }


        newTxt = text;
        var replaceNum = 0;
        var matchNum = (text.match(reg1) || []).length;

        while ((rows = reg1.exec(text)) !== null) {
            // console.log('rows =>');
            // console.log(rows);
            var rowList = rows[1].split(t2);
            //이 테이블이 다른 문법 안에 있으면 undefined가 아님.
            var sec = rows[2];
            //console.log(sec);
            // console.log('rowList =>');
            // console.log(rowList);

            if (rowList.length != 1) {
                for (var i = 0; i < rowList.length; i++) {
                    rowList[i] = changeCell(rowList[i]);
                }
                // console.log(rowList);
                if (num == 0 && sec == undefined) {
                    changeTable(c6 + rowList.join(c5) + c7 + '\n');
                } else if (num != 1) {
                    changeTable(c6 + rowList.join(c5) + c7 + sec);
                } else {
                    changeTable(c6 + rowList.join(c5) + c7);
                }

            } else {
                rowList[0] = changeCell(rowList[0]);

                if (num == 0 && sec == undefined) {
                    changeTable(c6 + rowList[0] + c7 + '\n');
                } else if (num != 1) {
                    changeTable(c6 + rowList[0] + c7 + sec);
                } else {
                    changeTable(c6 + rowList[0] + c7);
                }
            }
        }

        function changeCell(cells) {
            var cellList = cells.split(t1);
            // console.log(cellList);
            for (var j = 0; j < cellList.length; j++) {
                //console.log(cellList[j]);
                cellList[j] = cellList[j].replace(reg2, function (match, fir, sec, thi) {
                    var col = 1;
                    var row = 1;
                    var content;
                    if (fir != undefined) {
                        col = fir;
                    }

                    if (num == 0) {
                        if (sec != undefined) {
                            row = sec;
                        }
                        content = thi;

                        if (col == 1 && row == 1) {
                            return content;
                        } else if (row == 1) {
                            return col + "]" + content;
                        } else if (col == 1) {
                            return content + "[" + row;
                        } else {
                            return col + "]" + content + "[" + row;
                        }

                    } else if (num == 1) {
                        //console.log('content!');
                        //console.log(content);
                        if (thi != undefined) {
                            row = thi;
                        }
                        content = sec;

                        return "<td colspan='" + col + "' rowspan='" + row + "'>" + content + "</td>";

                    }
                });
            }
            return cellList.join(c1);
        }

        function changeTable(changeTxt) {
            replaceNum += 1;

            newTxt = newTxt.replace(reg3, changeTxt);

            if (replaceNum >= matchNum) {
                resolve(newTxt);
            }
        }
    });
}

//순서없는 리스트(목록) 문법
function unListGrammar(text, num) {

    return new Promise(resolve => {

        var reg1;
        var globalReg1;
        var globalReg2;
        var l1;
        var l2;
        var l3;

        if (num == 0) {

            reg1 = /<ul style='list-style: disc !important'><li>((?:.(?!<table>)(?!<ol>)(?!<ul)|\n)+?)<\/li><\/ul>(<\/li>|<\/td>)?/;
            globalReg1 = /<ul style='list-style: disc !important'><li>((?:.(?!<table>)(?!<ol>)(?!<ul)|\n)+?)<\/li><\/ul>(<\/li>|<\/td>)?/g;
            globalReg2 = /<\/li><li>/g;
            l1 = "\n)(";
            l2 = ":(";
            l3 = "\n):";

        } else if (num == 1) {

            reg1 = /(?<!\\):\(((?:[^:]|\n|:(?!\(|\{|\[)|\\:)+?)\n?\):\n?/;
            globalReg1 = /(?<!\\):\(((?:[^:]|\n|:(?!\(|\{|\[)|\\:)+?)\n?\):\n?/g;
            globalReg2 = /\n\)\((?!\()/g;
            l1 = '</li><li>';
            l2 = "<ul style='list-style: disc !important'><li>";
            l3 = "</li></ul>";
        }

        newTxt = text;
        var replaceNum = 0;
        var matchNum = (text.match(globalReg1) || []).length;

        while ((rows = globalReg1.exec(text)) !== null) {
            //0은 매칭된 부분 1은 캡쳐된 부분 2는 전체 부분
            //항목을 나누는 )(부분을 replace
            var rowList = rows[1].replace(globalReg2, l1);
            changeUnList(rowList);
        }

        function changeUnList(changeTxt) {
            replaceNum += 1;
            newTxt = newTxt.replace(reg1, function (match, fir, sec) {
                //console.log(sec);
                if (sec == undefined && num == 0) {
                    return l2 + changeTxt + l3 + '\n';
                } else if (num != 1) {
                    return l2 + changeTxt + l3 + sec;
                } else {
                    return l2 + changeTxt + l3;
                }
            });
            //console.log("changeUnList => " + newTxt);
            if (replaceNum >= matchNum) {
                resolve(newTxt);
            }
        }
    });
}

//순서있는 리스트(목록) 문법
function orListGrammar(text, num) {

    return new Promise(resolve => {

        var reg1;
        var globalReg1;
        var globalReg2;
        var l1;
        var l2;
        var l3;

        if (num == 0) {

            reg1 = /<ol><li>((?:.(?!<table>)(?!<ol>)(?!<ul)|\n)+?)<\/li><\/ol>(<\/li>|<\/td>)?/;
            globalReg1 = /<ol><li>((?:.(?!<table>)(?!<ol>)(?!<ul)|\n)+?)<\/li><\/ol>(<\/li>|<\/td>)?/g;
            globalReg2 = /<\/li><li>/g;
            l1 = "\n}{";
            l2 = ":{";
            l3 = "\n}:";

        } else if (num == 1) {

            reg1 = /(?<!\\):{((?:[^:]|\n|:(?!\(|{|\[)|\\:)+?)\n?}:\n?/;
            globalReg1 = /(?<!\\):{((?:[^:]|\n|:(?!\(|{|\[)|\\:)+?)\n?}:\n?/g;
            globalReg2 = /\n}{(?!{)/g;
            l1 = '</li><li>';
            l2 = "<ol><li>";
            l3 = "</li></ol>";
        }

        newTxt = text;
        var replaceNum = 0;
        var matchNum = (text.match(globalReg1) || []).length;

        while ((rows = globalReg1.exec(text)) !== null) {
            //0은 매칭된 부분 1은 캡쳐된 부분 2는 전체 부분
            //항목을 나누는 )(부분을 replace
            var rowList = rows[1].replace(globalReg2, l1);
            changeOrList(rowList);
        }

        function changeOrList(changeTxt) {
            replaceNum += 1;
            newTxt = newTxt.replace(reg1, function (match, fir, sec) {
                //console.log(sec);
                if (sec == undefined && num == 0) {
                    return l2 + changeTxt + l3 + '\n';
                } else if (num != 1) {
                    return l2 + changeTxt + l3 + sec;
                } else {
                    return l2 + changeTxt + l3;
                }
            });
            //console.log("changeOrList => " + newTxt);
            if (replaceNum >= matchNum) {
                resolve(newTxt);
            }
        }
    });
}

//이미지 문법
function imgGrammar(text, num) {
    return new Promise(function (resolve) {
        if (num == 0) {

            resolve(text.replace(/<img onclick='window.location.replace\(`파일:.+?`\);' style='cursor:pointer; (.+?)' alt='파일이 존재하지 않습니다.' name='(.+?)' src='.+?'>/g, function (match, size, name) {
                if (size == 'width:20rem') {
                    return "[{" + name + "}]";
                } else {
                    return "[{" + name + "|" + size + "}]";
                }
            }));


        } else if (num == 1) {
            var newTxt = text;
            var reg = /(?<!\\)\[{((?:[^|](?!}})(?!}])|\n)+[^|])\|?((?:(?<!\[{)[^|](?!}})(?!}])|\n)+[^|])?}\]/;
            var gReg = /(?<!\\)\[{((?:[^|](?!}})(?!}])|\n)+[^|])\|?((?:(?<!\[{)[^|](?!}})(?!}])|\n)+[^|])?}\]/g;
            var matchNum = (text.match(gReg) || []).length;
            var replaceNum = 0;

            if (matchNum == 0) {
                resolve(text);
            } else {

                //console.log(text.match(reg));
                changeImg(text.match(reg)[1], text.match(reg)[2]);
            }

            function changeImg(imgName, imgSize) {
                var reg = /(?<!\\)\[{((?:[^|](?!}})(?!}])|\n)+[^|])\|?((?:(?<!\[{)[^|](?!}})(?!}])|\n)+[^|])?}\]/;
                if (imgSize == undefined) {
                    imgSize = 'width:20rem';
                }
                fstorage.child('img/' + imgName).getDownloadURL().then(imgUrl => {
                    newTxt = newTxt.replace(/(?<!\\)\[{((?:[^|](?!}})(?!}])|\n)+[^|])\|?((?:(?<!\[{)[^|](?!}})(?!}])|\n)+[^|])?}\]/, "<img onclick='window.location.replace(`파일:" + imgName + "`);' style='cursor:pointer; " + imgSize + "' alt='파일이 존재하지 않습니다.' name='" + imgName + "' src='" + imgUrl + "'>");
                    replaceNum += 1;
                    if (replaceNum >= matchNum) {
                        resolve(newTxt);
                    } else {
                        //console.log(newTxt.match(reg));
                        changeImg(newTxt.match(reg)[1], newTxt.match(reg)[2]);
                    }
                }).catch(error => {
                    alert(imgName + ' 파일이 존재하지 않습니다.');
                    console.log(error);
                    loading(false);
                });
            }
        }
    });
}

//각주 문법
function noteGrammar(text, num) {
    return new Promise((resolve, reject) => {
        if (num == 0) {

            var parsedTxt = text.split('<hr/>');
            var trash = parsedTxt.pop();
            newTxt = parsedTxt.join('<hr/>');
            newTxt = newTxt.replace(/\[\+<a href='#foot_[0-9]+' id='note_[0-9]+' name="(.+?)">\[[0-9]+\]<\/a>\+]/g, '{{$1}}');
            newTxt = newTxt.replace(/\[\+<a href='#foot_[0-9]+' id='note_[0-9]+' name='(.+?)'>\[[0-9]+\]<\/a>\+]/g, '{{$1}}');

        } else if (num == 1) {

            var noteNum = 0;
            var noteList = new Array();

            text = text.concat('<hr/>');
            newTxt = text.replace(/(?<!\\)(?<!:)(?<!\n}){{((?:.|\n)+?)}}(?!:)/g, function (match, content) {

                if (onlyColName == '틀') {
                    alert('틀 문서에는 각주를 사용할 수 없습니다.');
                    loading(false);
                    reject();
                } else {
                    noteNum += 1;
                    var s = "<a href='#note_" + noteNum + "' id='foot_" + noteNum + "'>[" + noteNum + "]</a> " + content + "\n"
                    noteList[noteNum] = s;
                    return "<sup><a href='#foot_" + noteNum + "' id='note_" + noteNum + "' name='" + content.replace(/"/g, '&#34;').replace(/'/g, '&#39;') + "'>[" + noteNum + "]</a></sup>";
                }
            });

            for (var i = 1; i < noteList.length; i++) {

                newTxt = newTxt.concat(noteList[i]);
            }

        }

        resolve(newTxt);
    });
}

//목차 문법
function indexGrammar(text, num) {
    return new Promise(resolve => {
        if (num == 0) {
            //아직 바뀌지 않은 것도 있어서 보류중. 나중에 삭제
            newTxt = text;
            newTxt = newTxt.replace(/<h2 id='index_[0-9]*\.'><a href='#index'>[0-9]*\.<\/a>&nbsp(.+?)<\/h2>/g, "\n[=$1=]\n");
            newTxt = newTxt.replace(/<h3 id='index_[0-9]*\.[0-9]*\.'><a href='#index'>[0-9]*\.[0-9]*\.<\/a>&nbsp(.+?)<\/h3>/g, "\n[==$1==]\n");
            newTxt = newTxt.replace(/<h4 id='index_[0-9]*\.[0-9]*\.[0-9]*\.'><a href='#index'>[0-9]*\.[0-9]*\.[0-9]*\.<\/a>&nbsp(.+?)<\/h4>/g, "\n[===$1===]\n");
            newTxt = newTxt.replace(/<h5 id='index_[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*\.'><a href='#index'>[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*\.<\/a>&nbsp(.+?)<\/h5>/g, "\n[====$1====]\n");
            //이 아래가 새로운 부분
            newTxt = newTxt.replace(/<h2 id='index_[0-9]*_'><a href='#index'>[0-9]*\.<\/a>&nbsp(.+?)<\/h2>/g, "\n[=$1=]\n");
            newTxt = newTxt.replace(/<h3 id='index_[0-9]*_[0-9]*_'><a href='#index'>[0-9]*\.[0-9]*\.<\/a>&nbsp(.+?)<\/h3>/g, "\n[==$1==]\n");
            newTxt = newTxt.replace(/<h4 id='index_[0-9]*_[0-9]*_[0-9]*_'><a href='#index'>[0-9]*\.[0-9]*\.[0-9]*\.<\/a>&nbsp(.+?)<\/h4>/g, "\n[===$1===]\n");
            newTxt = newTxt.replace(/<h5 id='index_[0-9]*_[0-9]*_[0-9]*_[0-9]*_'><a href='#index'>[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*\.<\/a>&nbsp(.+?)<\/h5>/g, "\n[====$1====]\n");

        } else if (num == 1) {
            var index = 0;
            var matchNum;
            var high;
            var low;
            newTxt = text;

            text.replace(/(?<!\\)\n?\[=(?!=)(.+?)=]\n?/g, function (match, first) {
                addKeyword(first);
                return;
            });

            text.replace(/(?<!\\)\n?\[==(?!=)(.+?)==]\n?/g, function (match, first) {
                addKeyword(first);
                return;
            });

            text.replace(/(?<!\\)\n?\[===(?!=)(.+?)===]\n?/g, function (match, first) {
                addKeyword(first);
                return;
            });

            text.replace(/(?<!\\)\n?\[====(?!=)(.+?)====]\n?/g, function (match, first) {
                addKeyword(first);
                return;
            });

            while (index >= 0) {
                //첫번째 목차
                text = newTxt;
                index = parseInt((index + 1000000) / 1000000) * 1000000;
                newTxt = text.replace(/(?<!\\)\n?\[=(?!=)(.+?)=]\n?/, "<h2 id='index_" + parseInt(index / 1000000) + "_'><a href='#index'>" + parseInt(index / 1000000) + ".</a>&nbsp$1</h2>");

                if (newTxt == text) {
                    break;
                } else {

                    while (index >= 0) {
                        //두번째 목차
                        high = newTxt.search(/(?<!\\)\[=(?!=)(.+?)=]/);
                        low = newTxt.search(/(?<!\\)\[==(?!=)(.+?)==]/);

                        //alert("high => "+high+"\nlow => " + low);

                        if ((high != -1 && high < low) || low == -1) {
                            break;
                        } else {

                            text = newTxt;
                            index = parseInt((index + 10000) / 10000) * 10000;
                            newTxt = text.replace(/(?<!\\)\n?\[==(?!=)(.+?)==]\n?/, "<h3 id='index_" + parseInt(index / 1000000) + "_" + parseInt(index % 1000000 / 10000) + "_'><a href='#index'>" + parseInt(index / 1000000) + "." + parseInt(index % 1000000 / 10000) + ".</a>&nbsp$1</h3>");

                            while (index >= 0) {
                                //세번째 목차
                                high = newTxt.search(/(?<!\\)\[==(?!=)(.+?)==]/);
                                low = newTxt.search(/(?<!\\)\[===(?!=)(.+?)===]/);
                                if ((high != -1 && high < low) || low == -1) {
                                    break;
                                } else {

                                    text = newTxt;
                                    index = parseInt((index + 100) / 100) * 100;
                                    newTxt = text.replace(/(?<!\\)\n?\[===(?!=)(.+?)===]\n?/, "<h4 id='index_" + parseInt(index / 1000000) + "_" + parseInt(index % 1000000 / 10000) + "_" + parseInt(index % 10000 / 100) + "_'><a href='#index'>" + parseInt(index / 1000000) + "." + parseInt(index % 1000000 / 10000) + "." + parseInt(index % 10000 / 100) + ".</a>&nbsp$1</h4>");

                                    while (index >= 0) {
                                        //네번째 목차
                                        high = newTxt.search(/(?<!\\)\[===(?!=)(.+?)===]/);
                                        low = newTxt.search(/(?<!\\)\[====(?!=)(.+?)====]/);
                                        if ((high != -1 && high < low) || low == -1) {
                                            break;
                                        } else {

                                            text = newTxt;
                                            index = parseInt((index + 1) / 1) * 1;
                                            newTxt = text.replace(/(?<!\\)\n?\[====(?!=)(.+?)====]\n?/, "<h5 id='index_" + parseInt(index / 1000000) + "_" + parseInt(index % 1000000 / 10000) + "_" + parseInt(index % 10000 / 100) + "_" + parseInt(index % 100) + "_'><a href='#index'>" + parseInt(index / 1000000) + "." + parseInt(index % 1000000 / 10000) + "." + parseInt(index % 10000 / 100) + "." + parseInt(index % 100) + ".</a>&nbsp$1</h5>");

                                            if (newTxt == text) {
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        resolve(newTxt);
    });
}

//분류 문법 [#28기#]
//원래 가지고 있던 분류 리스트
//num 6는 상위분류 => 분류 문서를 편집할 때 라는 소리
//num 5는 분류 미리보기 / num 4는 일반 문서 미리보기
var oldClassList = new Array();
var classList = new Array();

function classGrammar(text, num) {

    return new Promise(resolve => {

        var newTxt = text;

        if (num == 0 || num == 2) {

            newTxt = text.split('<hr/>');
            newTxt[0] = newTxt[0].replace('분류:', '');
            newTxt[0] = newTxt[0].replace(/(?<!\\)(?:&nbsp)?\|?(?:&nbsp)?\[\[.+?\|(.+?)]](?!])/g, function (match, val) {
                if (num == 0) {
                    oldClassList.push(val);
                }
                return '[#' + val + '#]\n';
            });

            //console.log(oldClassList);

            resolve(newTxt.join(''));

        } else if (num == 1 || num == 4 || num == 5 || num == 6) {

            replaceClass(text).then(txt => {

                console.log(classList);

                for (var i = 0; i < classList.length; i++) {
                    addKeyword(classList[i].split('분류:').pop());
                }

                var removedClass = new Array();
                for (var i = 0; i < oldClassList.length; i++) {
                    var checkIsRemove = true;
                    for (var j = 0; j < classList.length; j++) {
                        if (oldClassList[i] == classList[j]) {
                            checkIsRemove = false;
                        }
                    }
                    if (checkIsRemove) {
                        removedClass.push(oldClassList[i]);
                    } else {
                        classList.splice(classList.indexOf(oldClassList[i]), 1);
                    }
                }

                console.log('원래 분류');
                console.log(oldClassList);
                console.log('추가 분류');
                console.log(classList);
                console.log('제거 분류');
                console.log(removedClass);

                if (num == 1 || num == 6) {
                    addClassLoop(txt, classList, 0, removedClass, num);
                } else if (num == 4 || num == 5) {
                    //여기가 미리보기 부분
                    if ((oldClassList.length + classList.length - removedClass.length) == 0) {
                        resolve("분류:&nbsp<a title='분류:미분류' href='분류:미분류'>미분류<\/a>" + txt);
                    } else {
                        resolve("분류:" + txt);
                    }
                }
            });

            function replaceClass(text) {
                return new Promise(resolve => {
                    var classNum = 0;

                    var newText = text.replace(/(?<!\\)\[#(.+?)#](?!])(?:\n)?/g, function (match, content) {
                        classList[classNum] = content;
                        classNum += 1;

                        return '';
                    });

                    var classTxt = '';
                    for (var i = 0; i < classList.length; i++) {
                        if (i == 0) {
                            classTxt = classTxt.concat("&nbsp<a title='분류:" + classList[i] + "' href='분류:" + classList[i] + "'>" + classList[i] + "<\/a>");
                        } else {
                            classTxt = classTxt.concat("&nbsp|&nbsp<a title='분류:" + classList[i] + "' href='분류:" + classList[i] + "'>" + classList[i] + "<\/a>");
                        }
                    }
                    //console.log('분류 후 텍스트 => ' + classTxt.concat('<hr/>' + newText));
                    resolve(classTxt.concat('<hr/>' + newText));
                });
            }

            function addClassLoop(Txt, classList, Num, removedClass, num) {

                if (Num < classList.length) {
                    console.log('분류:' + classList[Num] + '에 ' + fullName + '을(를) 추가하기 시작함');

                    if (num == 6) {
                        classRef.child(fullName.split(':').pop()).child('high').child(classList[Num]).set(true).then(() => {
                            classRef.child(fullName.split(':').pop()).child('high').once('value', function (snap) {
                                var lowClassHighClassList = [];
                                snap.forEach(function (value) {
                                    lowClassHighClassList.push(value.key);
                                });
                                changeClassData(lowClassHighClassList, 'high', fullName.split(':').pop());
                            });
                        })
                    }

                    classFunction("분류:" + classList[Num], 0, fullName).then(function () {
                        addClassLoop(Txt, classList, Num + 1, removedClass, num);
                    });

                } else {

                    console.log('---분류 추가 작업 끝---');
                    deleteClassLoop(Txt, removedClass, 0, classList, num);
                }
            }

            function deleteClassLoop(Txt, removedClass, Num, classList, num) {

                if (removedClass.length > Num) {
                    console.log('분류:' + removedClass[Num] + '의 ' + fullName + '을(를) 제거하기 시작함');

                    if (num == 6) {
                        classRef.child(fullName.split(':').pop()).child('high').child(removedClass[Num]).set(null).then(() => {
                            classRef.child(fullName.split(':').pop()).child('high').once('value', function (snap) {
                                var lowClassHighClassList = [];
                                if (snap.val() != null) {
                                    snap.forEach(function (value) {
                                        lowClassHighClassList.push(value.key);
                                    });
                                }
                                changeClassData(lowClassHighClassList, 'high', fullName.split(':').pop());
                            });
                        });
                    }

                    classFunction("분류:" + removedClass[Num], 1, fullName).then(function () {
                        deleteClassLoop(Txt, removedClass, Num + 1, classList, num);
                    });

                } else {
                    console.log('---분류 제거 작업 끝---');
                    // console.log(oldClassList);
                    // console.log(classList);
                    // console.log(removedClass);
                    console.log(oldClassList.length + classList.length - removedClass.length);
                    if ((oldClassList.length + classList.length - removedClass.length) == 0) {

                        classFunction("분류:미분류", 0, fullName).then(function () {

                            resolve("분류:&nbsp<a title='분류:미분류' href='분류:미분류'>미분류<\/a>" + Txt);
                        });
                    } else {
                        //console.log('분류:'+Txt);
                        resolve("분류:" + Txt);
                    }
                }
            }
        }
    });
}

//인용문 문법

function quoteGrammar(text, num) {
    return new Promise(resolve => {
        if (num == 0) {
            newTxt = text.replace(/<blockquote class='smallBlockquote'>((?:.|\n)+?)<\/blockquote>/g, "[>$1<]");
            newTxt = newTxt.replace(/<blockquote class='middleBlockquote'><em>((?:.|\n)+?)<\/em><\/blockquote>/g, "[>>$1<<]\n");
            newTxt = newTxt.replace(/<blockquote class='bigBlockquote'><em>((?:.|\n)+?)<\/em><\/blockquote>/g, "[>>>$1<<<]\n");

        } else if (num == 1) {
            newTxt = text.replace(/(?<!\\)\[>(?!>)((?:.|\n)+?)(?<!&lt;|<)(?:&lt;|<)]/g, function (match, first) {
                addKeyword(first);
                return "<blockquote class='smallBlockquote'>" + first + "</blockquote>"
            });
            newTxt = newTxt.replace(/(?<!\\)\[>>(?!>)((?:.|\n)+?)(?<!&lt;|<)(?:&lt;|<)(?:&lt;|<)](?:\n)?/g, "<blockquote class='middleBlockquote'><em>$1</em></blockquote>");
            newTxt = newTxt.replace(/(?<!\\)\[>>>(?!>)((?:.|\n)+?)(?<!&lt;|<)(?:&lt;|<)(?:&lt;|<)(?:&lt;|<)](?:\n)?/g, "<blockquote class='bigBlockquote'><em>$1</em></blockquote>");
        }

        resolve(newTxt);
    });
}

//버튼 문법
/*
function buttonGrammar(text, num) {
    if (num == 0) {

        text = text.replace(/<button onclick='javascript:(.*?)' style='(.*?)'>(.*?)<\/button>/g, "[)$1|$3|$2(]");
        //console.log(text);
        return text;

    } else if (num == 1) {
        text = text.replace(/(?<!\\)\[\)(.*?)\|(.*?)\|(.*?)\(\]/g, function (match, fir, sec, thi) {
            var Fir = fir.replace(/\n/g, ' ');
            var Thi = thi.replace(/\n/g, ' ');
            return "<button onclick='javascript:" + Fir + "' style='" + Thi + "'>" + sec + "</button>";
        });
        return text;
    }
}
*/
//프로그래밍 언어 문법

function codeGrammar(text, num) {
    return new Promise(resolve => {
        if (num == 0) {
            newTxt = text.replace(/<code>((?:.|\n)+?)<\/code>/g, "[code($1)]");
        } else if (num == 1) {
            newTxt = text.replace(/(?<!\\)\[code\(((?:(?:.|\n)(?!\[.*?\())+?)\)\]/g, "<code>$1</code>");
        }
        resolve(newTxt);
    });
}

//수식 문법
function mathGrammar(text, num) {
    return new Promise(resolve => {
        if (num == 0) {
            newTxt = text.replace(/\$\$((?:[^$]|\n)+?)\$\$/g, "[Math($1)]\n");
            newTxt = newTxt.replace(/\$((?:[^$]|\n)+?)\$(?!\$)/g, "[math($1)]");
        } else if (num == 1) {
            newTxt = text.replace(/(?<!\\)\[math\(((?:(?:.|\n)(?!\[.*?\())+?)\)\]/g, function (match, content) {
                return '$' + content + '$';
            });
            newTxt = newTxt.replace(/(?<!\\)\[Math\(((?:(?:.|\n)(?!\[.*?\())+?)\)\]\n?/g, function (match, content) {
                return '$$' + content + '$$';
            });
        }
        resolve(newTxt);
    });
}

//틀 불러오기 문법

var oldFrameList = [];
function frameGrammar(text, num) {
    return new Promise((resolve, reject) => {
        if (num == 0 || num == 2) {

            text.replace(/(?<!\\)\[틀\((.+?)\)\]/g, function (match, capture) {
                oldFrameList.push(capture);
            });
            resolve(text);

        } else if (num == 1 || num == 4 || num == 5 || num == 6) {

            console.log('원래 틀');
            console.log(oldFrameList);

            var matchNum = (text.match(/(?<!\\)\[틀\((.+?)\)\]/g) || []).length;
            if (matchNum == 0) {
                if (num == 4) {
                    text = text.replace(/\\\[틀\((.+?)\)\]/g, "[틀($1)]");
                }
                resolve(text);

            } else {

                var loopNum = 0;
                var frameNameList = [];

                text.replace(/(?<!\\)\[틀\((.+?)\)\]/g, function (match, capture) {
                    frameNameList.push(capture);
                    return match;
                });

                findFrame(frameNameList, matchNum, loopNum, num, text).then(text => {
                    if (num == 4) {
                        text = text.replace(/\\\[틀\((.+?)\)\]/g, "[틀($1)]");
                    }
                    resolve(text);
                });
            }
        }
    });
}
//보조 루프 함수
function findFrame(frameNameList, matchNum, loopNum, num, changeTxt) {
    return new Promise((resolve, reject) => {
        console.log('matchNum => ' + matchNum);
        console.log('loopNum => ' + loopNum);
        if (loopNum == matchNum) {
            resolve(changeTxt);
        } else {
            firebase.firestore().collection('document').doc('frame').collection('틀:' + frameNameList[loopNum]).orderBy('history', 'desc').limit(1).get({ source: 'server' }).then(value => {
                //console.log(value);
                if (value.empty) {
                    alert('틀:' + frameNameList[loopNum] + ' 문서가 존재하지 않습니다.');
                    loading(false);
                    reject();
                } else if (value.docs[0].data().private) {
                    alert('틀:' + frameNameList[loopNum] + ' 문서가 숨김 처리되어 있습니다.');
                    loading(false);
                    reject();
                } else if (value.docs[0].data().level > userLevel && oldFrameList.indexOf(frameNameList[loopNum]) == -1) {
                    alert('틀:' + frameNameList[loopNum] + ' 문서를 사용하기에는 권한이 부족합니다.\n필요권한: ' + value.docs[0].data().level);
                    loading(false);
                    reject();
                } else {
                    if (num == 4) {
                        changeTxt = changeTxt.replace(/(?<!\\)\[틀\((.+?)\)\]\n?/, "<div class='frameDiv' id='틀:$1'>" + value.docs[0].data().content.split('<hr/>')[1] + "<\/div>");
                    }
                    findFrame(frameNameList, matchNum, loopNum + 1, num, changeTxt).then(text => {
                        resolve(text);
                    });
                }
            });
        }
    });
}

//네임카드 문법
function cardGrammar(text, num) {
    return new Promise((resolve, reject) => {
        if (num == 0) {
            newTxt = text.replace(/<div style='margin-top: .8rem; border-radius: 2rem; padding: .8rem 1.5rem; font-size: 2.2rem; border: solid .2rem (.+?)'>(.+?)<\/div>/g, "[카드($1|$2)]");
        } else if (num == 1) {
            newTxt = text.replace(/(?<!\\)\[카드\(([^|]+?)\|([^|]+?)\)\]/g, "<div style='margin-top: .8rem; border-radius: 2rem; padding: .8rem 1.5rem; font-size: 2.2rem; border: solid .2rem $1'>$2</div>");
        }
        resolve(newTxt);
    });
}
//num 0은 불러오기, 1은 저장하기, 2는 역사에 사용 //num 0은 불러오기, 1은 저장하기, 2는 역사에 사용
//num 0은 불러오기, 1은 저장하기, 2는 역사에 사용 //num 0은 불러오기, 1은 저장하기, 2는 역사에 사용
//num 0은 불러오기, 1은 저장하기, 2는 역사에 사용 //num 0은 불러오기, 1은 저장하기, 2는 역사에 사용
//num 0은 불러오기, 1은 저장하기, 2는 역사에 사용 //num 0은 불러오기, 1은 저장하기, 2는 역사에 사용
//num 0은 불러오기, 1은 저장하기, 2는 역사에 사용 //num 0은 불러오기, 1은 저장하기, 2는 역사에 사용
//num 3은 문서 삭제에 사용//num 3은 문서 삭제에 사용//num 3은 문서 삭제에 사용//num 3은 문서 삭제에 사용
//num 4는 미리보기에 사용//num 4는 미리보기에 사용//num 4는 미리보기에 사용//num 4는 미리보기에 사용
//num 5는 분류 문서 편집할 때 미리보기에 사용
//num 5는 분류 문서 편집할 때 미리보기에 사용
//num 6도 분류에서 사용

var keywordObject = {};

function addKeyword(keyword) {
    //console.log(keyword);
    keyword = keyword.replace(/&lt;/g, '<');
    var keywordList = keyword.split(/(?:>|<| |\[|\(|\)|\]|{|}|\||\.|\/|#|\$|:)/g);

    if (keywordList == keyword) {
        if (keyword.length >= 2 && keyword.search(/\\/g) == -1) {
            if (keywordObject[keyword] != undefined) {
                var count = keywordObject[keyword];
                keywordObject[keyword] = count + 1;
            } else {
                keywordObject[keyword] = 1;
            }
        }
    } else {
        for (var i = 0; i < keywordList.length; i++) {
            addKeyword(keywordList[i]);
        }
    }
}

function grammar(text, num) {
    return new Promise(resolve => {
        if (num == 0 || num == 2) {

            text = text.replace(/<br>/g, '\n');
            text = text.replace(/&#39;/g, '\'');
            text = text.replace(/&#34;/g, '\"');

            text = noGrammar(text, 0);
            textGrammar(text, 0).then(text => {
                //console.log(text);
                ankerGrammar(text, 0).then(text => {
                    //console.log(text);
                    mathGrammar(text, 0).then(text => {
                        //console.log(text);
                        spanGrammar(text, 0).then(text => {
                            //console.log(text);
                            indexGrammar(text, 0).then(text => {
                                //console.log(text);
                                imgGrammar(text, 0).then(text => {
                                    //console.log(text);
                                    noteGrammar(text, 0).then(text => {
                                        //console.log(text);
                                        quoteGrammar(text, 0).then(text => {
                                            //console.log(text);
                                            blockGrammar(text, 0).then(text => {
                                                //console.log(text);
                                                gitaGrammar(text, 0).then(text => {
                                                    //console.log(text);
                                                    codeGrammar(text, 0).then(text => {
                                                        //console.log(text);
                                                        classGrammar(text, num).then(text => {
                                                            //console.log(text);
                                                            frameGrammar(text, 0).then(text => {

                                                                cardGrammar(text, 0).then(text => {

                                                                    text = text.replace(/&lt;/g, '<');


                                                                    if (num == 0) {
                                                                        $("#document").text(text);


                                                                    } else if (num == 2) {

                                                                        resolve(text);

                                                                    }
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
                        });
                    });
                });
            });

        } else if (num == 1 || num == 4 || num == 5) {
            //if (text.search('<hr/>') == -1) {

            console.log(text);

            //키워드 초기화
            keywordObject = {};

            if (text.search(/</) != -1 && num != 4) {
                if (userLevel >= 15) {
                    var adminSetting = prompt('0. 기본 세팅\n1. 자바스크립트 허용');

                    if (adminSetting == 1) {
                        //자바스크립트를 사용한다.
                    } else {
                        //기본 세팅
                        text = text.replace(/</g, '&lt;');
                    }
                } else {
                    text = text.replace(/</g, '&lt;');
                }
            }
            textGrammar(text, 1).then(text => {
                //console.log(text);
                ankerGrammar(text, 1).then(text => {
                    //console.log(text);
                    mathGrammar(text, 1).then(text => {
                        //console.log(text);
                        spanGrammar(text, 1).then(text => {
                            //console.log(text);
                            indexGrammar(text, 1).then(text => {
                                //console.log(text);
                                imgGrammar(text, 1).then(text => {
                                    //console.log(text);
                                    noteGrammar(text, 1).then(text => {
                                        //console.log(text);
                                        quoteGrammar(text, 1).then(text => {
                                            //console.log(text);
                                            blockGrammar(text, 1).then(text => {
                                                //console.log(text);
                                                gitaGrammar(text, 1).then(text => {
                                                    //console.log(text);
                                                    codeGrammar(text, 1).then(text => {
                                                        //console.log(text);
                                                        classGrammar(text, num).then(text => {
                                                            //console.log(text);
                                                            frameGrammar(text, num).then(text => {

                                                                cardGrammar(text, 1).then(text => {

                                                                    text = text.replace(/\n/g, '<br>');
                                                                    //console.log(text);
                                                                    text = noGrammar(text, 1);
                                                                    //console.log(text);

                                                                    resolve(text);
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
                        });
                    });
                });
            });
            /*} else {
                alert('<hr/>은 사용할 수 없습니다.');
                loading(false);
            }*/

        } else if (num == 3) {
            var txt = [text.replace(/"/g, "'")];
            txt[1] = noGrammar(txt[0], 0);
            txt[2] = txt[1].replace(/<a title='(.+?)' href='.+?'>(.+?)<\/a>/g, function (match, first, second) {
                if (first != second) {
                    return "[[" + first + "|" + second + "]]";
                } else {
                    return "[[" + first + "]]";
                }
            });
            txt[3] = txt[2].replace('<hr>', '<hr/>');
            //console.log(txt);
            classGrammar(txt[3], 0).then(() => {
                for (var i = 0; i < oldClassList.length; i++) {
                    oldClassList[i] = '분류:' + oldClassList[i];
                }
                //console.log(oldClassList);
                resolve(oldClassList);
            });
        }
    });
}


function noGrammar(text, num) {
    if (num == 0) {

        var txt = [text.replace(/\[\[/g, "\\[[")];
        txt[1] = txt[0].replace(/\["/g, "\\[\"");
        txt[2] = txt[1].replace(/\[\//g, "\\[/");
        txt[3] = txt[2].replace(/\['/g, "\\[\'");
        txt[4] = txt[3].replace(/\[_/g, "\\[_");
        txt[5] = txt[4].replace(/{{/g, "\\{{");
        txt[6] = txt[5].replace(/:](?:(?!:)|(?=:]))/g, "\\:]");
        txt[7] = txt[6].replace(/:\[/g, "\\:[");
        txt[8] = txt[7].replace(/\[\?/g, "\\[?");
        txt[9] = txt[8].replace(/:\(/g, "\\:(");
        txt[10] = txt[9].replace(/:{/g, "\\:{");
        txt[11] = txt[10].replace(/---/g, "\\---");
        txt[12] = txt[11].replace(/\[\+/g, "\\[+");
        txt[13] = txt[12].replace(/\[-/g, "\\[-");
        txt[14] = txt[13].replace(/\[====(?!=)/g, "\\[====");
        txt[15] = txt[14].replace(/\[===(?!=)/g, "\\[===");
        txt[16] = txt[15].replace(/\[==(?!=)/g, "\\[==");
        txt[17] = txt[16].replace(/\[=(?!=)/g, "\\[=");
        txt[18] = txt[17].replace(/\[\{/g, "\\[{");
        txt[19] = txt[18].replace(/\[#/g, "\\[#");
        txt[20] = txt[19].replace(/\[>(?!>)/g, "\\[>");
        txt[21] = txt[20].replace(/\[>>(?!>)/g, "\\[>>");
        txt[22] = txt[21].replace(/\[>>>(?!>)/g, "\\[>>>");
        txt[23] = txt[22].replace(/\[code\(/g, "\\[code(");
        txt[24] = txt[23].replace(/\[math\(/g, "\\[math(");
        txt[25] = txt[24].replace(/\[Math\(/g, "\\[Math(");
        txt[26] = txt[25].replace(/\[카드\(/g, "\\[카드(");
        return txt[26];


    } else if (num == 1) {
        //console.log(text);
        var txt = [text.replace(/\\\[\[/g, "[[")];
        txt[1] = txt[0].replace(/\\\["/g, "[\"");
        txt[2] = txt[1].replace(/\\\[\//g, "[/");
        txt[3] = txt[2].replace(/\\\['/g, "[\'");
        txt[4] = txt[3].replace(/\\\[_/g, "[_");
        txt[5] = txt[4].replace(/\\{{/g, "{{");
        txt[6] = txt[5].replace(/\\:](?:(?!:)|(?=:]))/g, ":]");
        txt[7] = txt[6].replace(/\\:\[/g, ":[");
        txt[8] = txt[7].replace(/\\\[\?/g, "[?");
        txt[9] = txt[8].replace(/\\:\(/g, ":(");
        txt[10] = txt[9].replace(/\\:{/g, ":{");
        txt[11] = txt[10].replace(/\\---/g, "---");
        txt[12] = txt[11].replace(/\\\[\+/g, "[+");
        txt[13] = txt[12].replace(/\\\[-/g, "[-");
        txt[14] = txt[13].replace(/\\\[====(?!=)/g, "[====");
        txt[15] = txt[14].replace(/\\\[===(?!=)/g, "[===");
        txt[16] = txt[15].replace(/\\\[==(?!=)/g, "[==");
        txt[17] = txt[16].replace(/\\\[=(?!=)/g, "[=");
        txt[18] = txt[17].replace(/\\\[\{/g, "[{");
        txt[19] = txt[18].replace(/\\\[#/g, "[#");
        txt[20] = txt[19].replace(/\\\[>(?!>)/g, "[>");
        txt[21] = txt[20].replace(/\\\[>>(?!>)/g, "[>>");
        txt[22] = txt[21].replace(/\\\[>>>(?!>)/g, "[>>>");
        txt[23] = txt[22].replace(/\\\[code\(/g, "[code(");
        txt[24] = txt[23].replace(/\\\[math\(/g, "[math(");
        txt[25] = txt[24].replace(/\\\[Math\(/g, "[Math(");
        txt[26] = txt[25].replace(/\\\[카드\(/g, "[카드(");
        return txt[26];
    }
}
var isClicked = false;
$("#saveBtn").off('click').on('click', function () {

    if (isClicked) {
        //console.log('다중클릭 하지마요');
    } else {
        isClicked = true;


        checkLevel().then(userLevel => {

            wikiCol.collection($('#titleH1').text()).orderBy('history', 'desc').limit(1).get({ source: 'server' }).then(snapshot => {

                if (!snapshot.empty) {
                    level = snapshot.docs[0].data().level;
                }

                var editPossible = true;

                if (userLevel == 0) {

                    alert('로그인 후 문서를 편집 및 생성할 수 있습니다.');
                    editPossible = false;

                }

                if (userName + '(' + userGisu + '기)' == fullName) {

                    editPossible = true;

                } else if (userLevel < level && his != 0) {

                    alert('권한이 부족하여 문서를 편집할 수 없습니다.');
                    editPossible = false;

                } else if (userLevel < makeLevel && his == 0) {

                    alert('권한이 부족하여 문서를 생성할 수 없습니다.');
                    editPossible = false;

                } else if (onlyColName == '분류' && his == 0) {

                    alert('분류 문서는 직접적으로 생성할 수 없습니다.');
                    editPossible = false;

                }

                if (editPossible) {

                    if (confirm("저장하시겠습니까?\n\n문서를 저장하게 되면 당신이 기여한 내용을 CC-BY-NC-SA 2.0으로 배포하는 것과 주소만으로 출처를 밝히는 데에 동의하는 것으로 간주합니다. 동의는 철회할 수 없습니다.")) {

                        loading(true);
                        wikiCol.collection(fullName).orderBy('history', 'desc').limit(1).get({ source: 'server' }).then(field => {
                            var nowHistoryNum = 0;
                            if (!field.empty) {
                                nowHistoryNum = field.docs[0].data().history;
                            }

                            if (nowHistoryNum != his) {
                                //동시 편집함
                                loading(false);
                                alert('다른 사용자가 먼저 편집하였습니다.\n수정한 내용을 따로 저장한 뒤 다시 편집 창을 열어주세요.\n자동병합 기능은 아직 지원하지 않습니다.');
                            } else {
                                //동시 편집 아님
                                var editTxt = $("#document").val();

                                if (onlyColName == '분류') {
                                    //분류 문서 저장
                                    //console.log('분류 문서 저장 시작!');
                                    classRef.child(onlyDocName).child('history').once('value', function (snap) {
                                        classRef.child(onlyDocName).child('history').set(snap.val() + 1).then(() => {
                                            classGrammar(editTxt + realClassContent, 6).then(text => {
                                                saveDoc(noGrammar(text, 1), keywordObject);
                                            });
                                        });
                                    });

                                } else {
                                    grammar(editTxt, 1).then(text => {
                                        saveDoc(text, keywordObject);
                                    });
                                }
                            }
                        });

                    } else {
                        isClicked = false;
                    }
                }
            });
        });
    }
});

$('#previewBtn').off('click').on('click', function () {
    $('.preTxt').remove();

    if (onlyColName == '분류') {
        console.log(realClassContent);
        grammar($("#document").val().replace(/</g, '&lt;') + realClassContent, 4).then(text => {
            $('article').append('<p class="preTxt" style="font-size: 2rem"></p>');
            $('.preTxt').append(text.replace(/\\\[넘겨주기\((.+?)\)\]/g, '[넘겨주기($1)]'));
            MathJax.Hub.Typeset();
        });

    } else {
        console.log('preview');
        grammar($("#document").val(), 4).then(text => {
            $('article').append('<p class="preTxt" style="font-size: 2rem"></p>');
            $('.preTxt').append(text.replace(/\\\[넘겨주기\((.+?)\)\]/g, '[넘겨주기($1)]'));
            MathJax.Hub.Typeset();
        });

    }

});