//문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!
//문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!
//문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!
//문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!문법들!


var newTxt = '';
//링크 문법

function anchorGrammar(reason) {
  return new Promise(resolve => {
    if (reason == 'load') {

      docInfo.content = docInfo.content.replace(/(?<!\\)\[\[(?:((?:}]|[^|])+?)|(.+?)\|((?:}]|.)+?))]](?!;)/g, function (match, link1, link2, name) {

        if (link1 != undefined) {
          if (link1.search(/^[0-9]+?기:/) != -1) {
            link2 = link1;
            name = link1.split(':').pop();
          } else if (link1.search(/^선생님:/) != -1) {
            link2 = link1;
            name = link1.split(':').pop() + ' 선생님';
          } else {
            link2 = link1;
            name = link1;
          }
          /*else if (link1.search(/(?:.|\n)+?\(동아리\)/) != -1) {
                                 link2 = link1;
                                 name = link1.split('(')[0];
                             }*/
        }

        name = decode(name);

        if (link2[0] == '#' || link2.search(/^https?:\/\//g) != -1) {
          return '<a title="' + link2 + '" href="' + link2 + '">' + name + '</a>';
        } else {
          if (serialize(link2) == undefined) {
            var temporaryLink2 = link2.split('#');
            temporaryLink2.pop();
            if (serialize(temporaryLink2.join('#')) != undefined) {
              return '<a title="' + link2 + '" href="w/' + link2 + '">' + name + '</a>';
            } else {
              return '<a title="' + link2 + '" href="w/' + link2 + '" style="color: red !important;">' + name + '</a>';
            }

          } else {
            return '<a title="' + link2 + '" href="w/' + link2 + '">' + name + '</a>';
          }
        }
      });

      resolve();

    } else if (reason == 'edit') {

      docInfo.content = docInfo.content.replace(/(?<!\\)\[\[(?:((?:}]|[^|])+?)|(.+?)\|((?:}]|.)+?))]](?!;)/g, function (match, link1, link2, name) {

        if (link1 != undefined) {
          link2 = link1;
        }

        if (link2[0] == '#' || link2.search(/^https?:\/\//g) != -1) {
          //역링크 추가하면 안됨.
        } else if (link2.search(/#/g) != -1) {
          docInfo.link[encode(link2.split('#').slice(0, -1).join('#'))] = null;
        } else if (link2.search(/\?/g) != -1) {
          docInfo.link[encode(link2.split('?').slice(0, -1).join('?'))] = null;
        } else {
          docInfo.link[encode(link2)] = null;
        }

        return match;
      });

      resolve();
    } else if (reason == 'save') {

      docInfo.content = docInfo.content.replace(/(?<!\\)\[\[(?:((?:}]|[^|])+?)|(.+?)\|((?:}]|.)+?))]](?!;)/g, function (match, link1, link2, name) {


        if (link1 != undefined) {
          if (link1[0] == '#' || link1.search(/^https?:\/\//g) != -1) {
            //역링크 추가하면 안됨.
          } else if (link1.search(/#/g) != -1) {
            docInfo.link[encode(link1.split('#').slice(0, -1).join('#'))] = true;
          } else if (link1.search(/\?/g) != -1) {
            docInfo.link[encode(link1.split('?').slice(0, -1).join('?'))] = true;
          } else {
            docInfo.link[encode(link1)] = true;
          }

          if (link1.search(/^[0-9]+?기:/) != -1 || link1.search(/^선생님:/) != -1) {
            addKeyword(link1.split(':').pop());
            return match;
          } else {
            addKeyword(link1);
            return match;
          }
        } else {
          if (link2[0] == '#' || link2.search(/^https?:\/\//g) != -1) {
            //역링크 추가하면 안됨.
          } else if (link2.search(/#/g) != -1) {
            docInfo.link[encode(link2.split('#').slice(0, -1).join('#'))] = true;
          } else if (link2.search(/\?/g) != -1) {
            docInfo.link[encode(link2.split('?').slice(0, -1).join('?'))] = true;
          } else {
            docInfo.link[encode(link2)] = true;
          }
          addKeyword(name);
          addKeyword(link2);
          return match;
        }
      });

      //console.log(docInfo.link);

      resolve();
    }
  });
}

//글자 서식 문법
function textGrammar(reason) {
  return new Promise(resolve => {
    if (reason == 'load') {

      grammarLoop(/(?<!\\)\["((?:(?:.|\n)(?!\["))+?)"]/g, "<b>$1</b>").then(() => {
        grammarLoop(/(?<!\\)\[\/((?:(?:.|\n)(?!\[\/))+?)\/]/g, "<i>$1</i>").then(() => {
          grammarLoop(/(?<!\\)\['((?:(?:.|\n)(?!\['))+?)']/g, "<ins>$1</ins>").then(() => {
            grammarLoop(/(?<!\\)\[_((?:(?:.|\n)(?!\[_))+?)_]/g, "<del>$1</del>").then(() => {
              grammarLoop(/(?<!\\)\[\+((?:(?:.|\n)(?!\[\+))+?)\+]/g, "<sup>$1</sup>").then(() => {
                grammarLoop(/(?<!\\)\[\-((?:(?:.|\n)(?!\[\-))+?)\-]/g, "<sub>$1</sub>").then(() => {
                  resolve();
                })
              })
            })
          })
        })
      })
      // docInfo.content = docInfo.content.replace(/(?<!\\)\[\/((?:(?:.|\n)(?!\[\/))+?.)\/]/g, "<i>$1</i>");
      // docInfo.content = docInfo.content.replace(/(?<!\\)\['((?:(?:.|\n)(?!\['))+?.)']/g, "<ins>$1</ins>");
      // docInfo.content = docInfo.content.replace(/(?<!\\)\[_((?:(?:.|\n)(?!\[_))+?.)_]/g, "<del>$1</del>");

      // docInfo.content = docInfo.content.replace(/(?<!\\)\[\+((?:(?:.|\n)(?!\[\+))+?.)\+]/g, "<sup>$1</sup>");
      // docInfo.content = docInfo.content.replace(/(?<!\\)\[\-((?:(?:.|\n)(?!\[\-))+?.)\-]/g, "<sub>$1</sub>");

    } else if (reason == 'save') {
      grammarLoop(/(?<!\\)\["((?:(?:.|\n)(?!\["))+?)"]/g, function (match, first) {
        addKeyword(first);
        return '';
      }, docInfo.content).then(() => {
        resolve();
      })

    }
  });
}

function grammarLoop(reg, tag, content) {
  return new Promise((resolve, reject) => {
    if (content == undefined) {
      docInfo.content = docInfo.content.replace(reg, tag);
      if (docInfo.content.search(reg) != -1) {
        grammarLoop(reg, tag).then(() => {
          resolve();
        })
      } else {
        resolve();
      }
    } else {
      content = content.replace(reg, tag);
      if (content.search(reg) != -1) {
        grammarLoop(reg, tag, content).then(() => {
          resolve();
        })
      } else {
        resolve(content);
      }
    }
  });
}

//기타 문법
//들여쓰기, 취소선
function gitaGrammar(reason) {
  return new Promise(resolve => {
    if (reason == 'load') {
      docInfo.content = docInfo.content.replace(/(?<!\\)---(?:\n)?/g, "<hr>");
      docInfo.content = docInfo.content.replace(/(?<!\\):](?:(?!:)|(?=:]))/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
      resolve();
    } else if (reason == 'save') {
      resolve();
    }


  });
}

//span 문법
function spanGrammar(reason) {
  return new Promise(resolve => {
    if (reason == 'load') {
      grammarLoop(/(?<!\\)\[\)((?:.(?!\[\)))+?)\|((?:(?:.|\n)(?!\[\)))+?)\(]/g, '<span style="$1">$2</span>').then(() => {
        resolve();
      })
    } else if (reason == 'save') {
      resolve();
    }
  });
}

//테이블(표) 문법
function tableGrammar(reason) {
  return new Promise(resolve => {

    // \n]가로로 합칠 개수]세로로 합칠 개수] 칸1 ||가로로 합칠 개수]세로로 합칠 개수] 칸2
    if (reason == 'load') {

      var cellList = [];

      var tableTxt = '<table><tr>';

      var tableList = [];

      //console.log(docInfo.content);

      docInfo.content = docInfo.content.replace(/(?:\n|>|^)(\)|})?\]((?:(?:\n|.)(?!(?:\n|>|^)\])(?<!\];))*.)/g, function (match, list, line) {

        //console.log(line);

        if (list != undefined) {
          // tableTxt = '<table><tr>';
          cellList.push('list');
        }

        cellList.push('line');

        for (k in line.split('||')) {

          if (line.split('||')[k].search(/\];(?:<hr\/>)?$/) != -1) {
            cellList.push(line.split('||')[k].split('];').slice(0, -1).join('];'));
            cellList.push('end');
          } else {
            cellList.push(line.split('||')[k]);
          }
        }

        //console.log(cellList);

        return match;
      });

      //console.log(cellList);

      for (var i = 0; i < cellList.length; i++) {


        if (cellList[i] != 'list') {

          if (cellList[i] != 'end') {

            if (cellList[i] != 'line') {

              cellList[i] = cellList[i].toString().replace(/^(?:([^\]]+)\|)?(?:([0-9]*)\]([0-9]*)\])?((?:.|\n)+)/g, function (match, style, col, row, content) {
                if (row == undefined || row == '') {
                  row = 1;
                }

                if (col == undefined || col == '') {
                  col = 1;
                }

                if (style != undefined) {
                  style = 'style="' + style + '"';
                } else {
                  style = '';
                }

                tableTxt = tableTxt.concat('<td ' + style + ' colspan=' + col + ' rowspan=' + row + '>' + content + '</td>');

                return match;
              });

            } else {
              tableTxt = tableTxt.concat('</tr><tr>');
            }

          } else {
            tableTxt = tableTxt.concat('</tr></table>');
            tableList.push(tableTxt);
            tableTxt = '<table><tr>';
            i++;
          }
        }
      }

      var countTable = 0;

      docInfo.content = docInfo.content.replace(/(\n|>|^)(\)|})?\]((?:.|\n)+?)\];(<hr\/>)?/g, function (match, first, second, line, last) {

        countTable++;

        //last는 <hr/>을 의미...
        if (last == undefined) {
          last = '';
        }

        if (second == undefined) {
          second = '';
        }

        return first + second + tableList[countTable - 1] + last;

      });

      //console.log(tableList);

      docInfo.content = docInfo.content.replace(/<\/table>\n/g, '</table>');

      // console.log(docInfo.content);

      resolve();


    } else if (reason == 'save') {
      resolve();
    }
  });
}

//리스트(목록) 문법
function listGrammar(reason) {

  return new Promise(resolve => {

    //2차 개편

    if (reason == 'load') {

      var listKind = '';
      var listStart = '';
      var listEnd = '';

      for (var kind = 0; kind < 2; kind++) {
        if (kind == 0) {
          listKind = ')';
          listEnd = '</ul>';
        } else if (kind == 1) {
          listKind = '}';
          listEnd = '</ol>';
        }

        var checkLevelReg = new RegExp('(?:\\n|>|^)( *)\\' + listKind /* + '(?!;)'*/ , 'g');


        var highListLevel = 0;

        docInfo.content = docInfo.content.replace(checkLevelReg, function (match, capture) {
          var listLevel = capture.split(' ').length;

          //console.log(match);

          if (highListLevel < listLevel) {
            highListLevel = listLevel;
          }

          return match;
        });

        //console.log(highListLevel);

        for (var i = highListLevel - 1; i > -1; i--) {

          if (kind == 0) {
            listStart = '<ul class="ul-' + (i + 1) + '" style="list-style: disc !important">';

          } else if (kind == 1) {
            listStart = '<ol class="ol-' + (i + 1) + '">';
          }

          var listReg = new RegExp('((?:\\n|>|^) {' + i + '}\\' + listKind + '(?:.|\\n)*?)\\' + listKind + ';', 'g');
          var splitReg = new RegExp('(?:\\n|>|^) {' + i + '}\\' + listKind);

          docInfo.content = docInfo.content.replace(listReg, function (match, content) {

            // //split 하면서 사라진 > 문자를 돌려주기 위해서 미리 추가.
            // content = content.replace(splitReg, function (match, first) {
            //     if(first == '>') {
            //         return '>' + match;
            //     } else {
            //         return match;
            //     }
            // })
            var contentList = content.split(splitReg);
            var newContent = '';

            if (match[0] == '\n' || match[0] == '>') {
              newContent = match[0];
            }

            //console.log(content);
            // if (content[0] == '>') {
            //     newContent = '>';
            //     //content = content.slice(1);
            // }
            //console.log(content);

            newContent = newContent.concat(listStart);

            for (var k = 1; k < contentList.length; k++) {
              newContent = newContent.concat('<li>' + contentList[k] + '</li>');
            }

            newContent = newContent.concat(listEnd);

            //console.log(newContent);

            return newContent;
          });
        }
      }

      docInfo.content = docInfo.content.replace(/<\/ul>\n/g, '</ul>');
      docInfo.content = docInfo.content.replace(/<\/ol>\n/g, '</ol>');
      docInfo.content = docInfo.content.replace(/<\/table(?!>)/g, '</table>');

      resolve();


    } else if (reason == 'save') {
      resolve();
    }
  });
}

//이미지 문법
function imageGrammar(reason) {
  return new Promise(function (resolve) {
    if (reason == 'load') {

      var reg = /(?<!\\)\[{((?:[^|](?!}})(?!}])|\n)+[^|])\|?((?:(?<!\[{)[^|](?!}})(?!}])|\n)+[^|])?}\]/;
      var gReg = /(?<!\\)\[{((?:[^|](?!}})(?!}])|\n)+[^|])\|?((?:(?<!\[{)[^|](?!}})(?!}])|\n)+[^|])?}\]/g;
      var matchNum = (docInfo.content.match(gReg) || []).length;

      if (matchNum == 0) {
        resolve();
      } else {

        //console.log(text.match(reg));
        changeImg(docInfo.content.match(reg)[1], docInfo.content.match(reg)[2], 0, matchNum).then(() => {
          resolve();
        });
      }
    } else if (reason == 'edit') {

      console.log(docInfo.link);

      docInfo.content = docInfo.content.replace(/(?<!\\)\[{((?:[^|](?!}})(?!}])|\n)+[^|])\|?((?:(?<!\[{)[^|](?!}})(?!}])|\n)+[^|])?}\]/g, function (match, imageName, style) {
        docInfo.link['파일:' + encode(imageName)] = null;
        return match;
      });

      resolve();

    } else if (reason == 'save') {
      docInfo.content = docInfo.content.replace(/(?<!\\)\[{((?:[^|](?!}})(?!}])|\n)+[^|])\|?((?:(?<!\[{)[^|](?!}})(?!}])|\n)+[^|])?}\]/g, function (match, imageName, style) {
        addKeyword(imageName);
        docInfo.link['파일:' + encode(imageName)] = true;
        return match;
      });
      resolve();

    }
  });
}

function changeImg(imageName, imageSize, replaceNum, matchNum) {
  return new Promise((resolve, reject) => {


    var imageReg = /(?<!\\)\[{((?:[^|](?!}})(?!}])|\n)+[^|])\|?((?:(?<!\[{)[^|](?!}})(?!}])|\n)+[^|])?}\](?!<\/span>)/;
    if (imageSize == undefined) {
      imageSize = 'width:20rem;';
    }

    if (serialNote['파일:' + imageName] == undefined) {
      //이미지 존재 x

      docInfo.content = docInfo.content.replace(imageReg, function (match) {
        return '<span style="color: red;">' + match + '</span>';
      });

      replaceNum++;

      if (replaceNum >= matchNum) {
        resolve();
      } else {
        changeImg(docInfo.content.match(imageReg)[1], docInfo.content.match(imageReg)[2], replaceNum, matchNum).then(() => {
          resolve();
        });
      }

    } else {
      fstorage.child('image/' + imageName).getDownloadURL().then(imageUrl => {
        docInfo.content = docInfo.content.replace(imageReg, '<img onclick="movePage(`파일:' + imageName + '`, ``, ``, `w`);" style="cursor:pointer; ' + imageSize + '" alt="파일이 존재하지 않습니다." name="' + imageName + '" src="' + imageUrl + '">');

        replaceNum++;

        if (replaceNum >= matchNum) {
          resolve();
        } else {
          changeImg(docInfo.content.match(imageReg)[1], docInfo.content.match(imageReg)[2], replaceNum, matchNum).then(() => {
            resolve();
          });
        }
      }).catch(error => {
        //alert(imageName + ' 파일이 존재하지 않습니다.');
        console.log(error);
      });
    }
  });
}

//각주 문법
function noteGrammar(reason) {
  return new Promise((resolve, reject) => {

    if (reason == 'load') {

      if (docInfo.type == 'frame') {

        resolve();

      } else {

        let noteList = []; //[각주내용]
        let indexNameList = []; //[각주이름]
        let indexNumList = []; //[각주번호]

        //noteIndex 기본 번호
        let noteIndex = 0;

        //특정 번호
        let indexNum = 0;

        if (docInfo.type == 'normal' || docInfo.type == 'settlement' || docInfo.type == 'wait' || docInfo.type == 'close' || docInfo.type == 'command') {
          //토론의 댓글이면
          console.log('토론 댓글 각주 부분 실행');
          console.log(docInfo);
          noteIndex = docInfo.noteIndex;
          //indexNum = docInfo.indexNum;
          if (docInfo.content.search(/(?<!\\){{(?:((?:[^|]|\n)+?)|(.+?)\|((?:.|\n)*?))}}(?!;)/) != -1) {
            docInfo.content = docInfo.content.concat('<hr/>');
          }
        }



        //console.log(docInfo.content);

        docInfo.content = docInfo.content.replace(/(?<!\\){{(?:((?:[^|]|\n)+?)|(.+?)\|((?:.|\n)*?))}}(?!;)/g, function (match, note1, index, note2) {

          if (note1 != undefined) {
            noteIndex++;
            //note1은 각주 이름이 없을 때 각주 내용이 담긴다.
            note2 = note1;
            index = noteIndex;
            indexNum = noteIndex;
            indexNumList.push(noteIndex);

          } else if (note2 == '') { //각주 이름이 있다면 index에 각주 이름이, note2에 각주 내용이 담긴다.

            if (indexNameList.indexOf(index) == -1) {
              //이름밖에 없는데 같은 이름의 각주가 없다.
              noteIndex++;
              note2 = '같은 이름을 가진 각주 중에서 가장 처음에 나오는 각주에 내용을 넣어주세요.';
              //let indexReg = new RegExp('(?<!\\\\)\\{\\{' + index + '(?:|.*?)?}}')
              indexNum = Number(noteIndex + '.1');
              indexNumList.push(noteIndex + '.1');
            } else {
              //같은 이름의 각주가 있어서 그 내용을 복사해서 넣는다.
              note2 = noteList[indexNameList.indexOf(index)];


              let indexCount = indexNameList.filter(function (e) {
                if (e == index) {
                  return true;
                }
              });
              indexNum = Number(indexNumList[indexNameList.indexOf(index)].split('.')[0] + '.' + (indexCount.length + 1));
              indexNumList.push(indexNumList[indexNameList.indexOf(index)].split('.')[0] + '.' + (indexCount.length + 1));
            }

          } else {
            //각주 내용도 있고 이름도 있다. 그냥 넘어가면 된다.
            noteIndex++;
            //let indexReg = new RegExp('(?<!\\\\)\\{\\{' + index + '(?:|.*?)?}}')
            indexNum = Number(noteIndex + '.1');
            indexNumList.push(noteIndex + '.1');
          }

          noteList.push(note2);
          indexNameList.push(index);

          return '<sup><a href="#f-' + Number(String(indexNum).split('.')[0]) + '" id="n-' + indexNum + '">[' + index + ']</a></sup>';

        });

        // console.log(indexNameList);
        // console.log(indexNumList);
        // console.log(noteList);

        if (docInfo.type == 'normal' || docInfo.type == 'settlement' || docInfo.type == 'wait' || docInfo.type == 'close' || docInfo.type == 'command') {
          //토론의 댓글이면
          docInfo.noteIndex = noteIndex;
        }

        let sameIndexNameList = [];

        //console.log(indexNumList);

        for (let i = 0; i < indexNameList.length; i++) {
          if (indexNameList.filter(function (e) {
              if (e == indexNameList[i]) {
                return true;
              }
            }).length > 1) {
            //이름이 같은 각주가 여러개면

            if (sameIndexNameList.indexOf(indexNameList[i]) == -1) {
              //새로 추가해야 하는 각주

              sameIndexNameList.push(indexNameList[i]);

              //이번 각주 대표 번호 => 2.3이면 2가 대표번호
              let indexBigNum = indexNumList[i].split('.')[0];

              docInfo.content = docInfo.content
                .concat(`<div id="f-${indexBigNum}"><p>[${indexNameList[i]}]</p><sup>`);
              indexNumList.filter(function (e) {
                if (String(e).split('.')[0] == indexBigNum) {
                  docInfo.content = docInfo.content.concat(` <a href="#n-${e}">${e}</a>`);
                  return true;
                }
              });

              docInfo.content = docInfo.content.concat(`</sup><div>${noteList[i]}</div></div>`);
            } else {
              //이미 추가한 각주
            }
          } else {
            docInfo.content = docInfo.content.concat(`<div id="f-${indexNumList[i]}"><a href="#n-${indexNumList[i]}">[${indexNameList[i]}]</a><div>${noteList[i]}</div></div>`);
            //console.log(docInfo.content);
          }

        }

        resolve();
      }


    } else if (reason == 'save') {

      resolve();

    }
  });
}

//목차 문법
function indexGrammar(reason) {
  return new Promise(resolve => {

    if (reason == 'load') {

      var keyList = [];

      for (key in docInfo.document) {
        if (key != 'content') {
          keyList.push(key);
        }
      }

      keyList.sort(function (a, b) {
        let A = a.split('|')[0].split('-');
        let B = b.split('|')[0].split('-');
        for (var i = 0; i < 8; i++) {
          if (Number(A[i]) > Number(B[i])) {
            return 1;
          } else if (Number(A[i]) < Number(B[i])) {
            return -1;
          } else if (A[i + 1] == undefined) {
            return -1;
          } else if (B[i + 1] == undefined) {
            return 1;
          }
        }
      });

      //console.log(keyList);

      var docContent = '';
      //목차1.1.
      var docIndexTitle = '';
      //1-1
      var docIndexNumber;
      var docIndexLevel;

      if (docInfo.document['content'] != undefined) {

        docInfo.content = docInfo.content.concat(docInfo.document['content']);

      }

      // console.log(keyList);

      for (k in keyList) {

        docContent = docInfo.document[keyList[k]];

        if (keyList[k] != 'content') {

          var docIndexArray = keyList[k].split('|');
          docIndexNumber = String(docIndexArray.splice(0, 1));
          docIndexTitle = docIndexArray.join('|');

          docIndexLevel = (docIndexNumber.split('-') || ['']).length;

          docInfo.content = docInfo.content.concat('<h' + (docIndexLevel + 1) + ' id="p-' + docIndexNumber + '">' +
            '<a href="#index">' + docIndexNumber.replace(/-/g, '.') + '.</a>&nbsp;' +
            docIndexTitle + '</h' + (docIndexLevel + 1) + '>' +
            '<div class="container"><div style="width: -webkit-fill-available;">' +
            docContent + '\n</div></div>');
        }
      }

      docInfo.content = docInfo.content.replace(/<div class="container"><div style="width: -webkit-fill-available;">\n<\/div><\/div>/g, '<div class="container"><div style="width: -webkit-fill-available;"></div></div>');

      if (docInfo.type == 'class') {
        //분류문서라면
        makeClassContents(docInfo.lowClass, docInfo.lowDoc, docInfo.name).then(() => {
          docInfo.content = docInfo.content.concat('<hr/>');

          //console.log(docInfo.content);

          resolve();
        });
      } else {
        docInfo.content = docInfo.content.concat('<hr/>');

        //console.log(docInfo.content);

        resolve();
      }

    } else if (reason == 'edit') {

      var keyList = [];

      for (key in docInfo.document) {
        if (key != 'content') {
          keyList.push(key);
        }
      }

      keyList.sort(function (a, b) {
        let A = a.split('|')[0].split('-');
        let B = b.split('|')[0].split('-');
        for (var i = 0; i < 8; i++) {
          if (Number(A[i]) > Number(B[i])) {
            return 1;
          } else if (Number(A[i]) < Number(B[i])) {
            return -1;
          } else if (A[i + 1] == undefined) {
            return -1;
          } else if (B[i + 1] == undefined) {
            return 1;
          }
        }
      });

      var docContent = '';
      //목차1.1.
      var docIndexTitle = '';
      //1-1
      var docIndexNumber;
      var docIndexLevel;

      if (docInfo.document['content'] != undefined) {

        docInfo.content = docInfo.content.concat(docInfo.document['content']);

      }

      for (k in keyList) {

        docContent = docInfo.document[keyList[k]];

        if (keyList[k] != 'content') {

          var docIndexArray = keyList[k].split('|');
          docIndexNumber = String(docIndexArray.splice(0, 1));
          docIndexTitle = docIndexArray.join('|');

          docIndexLevel = (docIndexNumber.split('-') || ['']).length;

          docInfo.content = docInfo.content.concat('\n');

          for (var i = 0; i < docIndexLevel; i++) {
            docInfo.content = docInfo.content.concat('=');
          }

          if (docContent == '') {
            docInfo.content = docInfo.content.concat('] ' + docIndexTitle + '\n');
          } else {
            docInfo.content = docInfo.content.concat('] ' + docIndexTitle + '\n' + docContent + '\n');
          }
        }
      }

      docInfo.content = docInfo.content.replace(/\n$/, '');

      //console.log(docInfo.content);

      resolve();

    } else if (reason == 'make') {

      docInfo.document = {};

      var lastLevel = 0;
      //실제로 사용되는 것은 0번부터 3번이지만 if로 나누기 귀찮아서 나머지도 만들어 둬야 한다.
      var indexList = [0, 0, 0, 0, 0, 0, 0];

      var maxLoopNum = (docInfo.content.match(/\n?(?<!\\)((?<!=)={1,4})\] ?(.+)/g) || []).length;

      if (maxLoopNum == 0 || checkType(getDocName()) == 'frame') {

        docInfo.document['content'] = docInfo.content;
        resolve();

      } else {

        docInfo.content = docInfo.content.replace(/\n?(?<!\\)((?<!=)={1,4})\] ?(.+?)\n((?:.|\n)*?)(?=\n?(?<!\\)(?<!=)={1,4}\])/g, function (match, level, title, content) {

          var nextLevel = level.length - 1;

          indexList[nextLevel] = indexList[nextLevel] + 1;
          indexList[nextLevel + 1] = 0;
          indexList[nextLevel + 2] = 0;
          indexList[nextLevel + 3] = 0;
          lastLevel = nextLevel;

          //이것 역시 귀찮아서 일단 배열로 만들어 두는 것임.
          var dashLevel = [];
          for (var i = 0; i < nextLevel + 1; i++) {
            dashLevel.push(indexList[i]);
          }
          //결국 1-2-4 이런 형태로 저장됨.
          dashLevel = dashLevel.join('-');

          //마지막에 생기는 엔터를 없애기 위함 //사실 굳이 없앨 필요는 없는데 저장공간을 아낀다고 치자.
          content = content.replace(/\n$/, '');

          if (docInfo.content.replace(/\n/g, '').trim() == '') {
            content = '';
          }

          docInfo.document[dashLevel + '|' + title] = content;
          return '';
        });

        //console.log(docInfo.content);

        docInfo.content = docInfo.content + '\n';

        //마지막에 목차 하나가 무조건 남기 때문에 처리.
        docInfo.content = docInfo.content.replace(/\n?(?<!\\)((?<!=)={1,4})\] ?(.+?)\n((?:.|\n)*)/g, function (match, level, title, content) {

          var nextLevel = level.length - 1;

          indexList[nextLevel] = indexList[nextLevel] + 1;
          indexList[nextLevel + 1] = 0;
          indexList[nextLevel + 2] = 0;
          indexList[nextLevel + 3] = 0;
          lastLevel = nextLevel;

          //이것 역시 귀찮아서 일단 배열로 만들어 두는 것임.
          var dashLevel = [];
          for (var i = 0; i < nextLevel + 1; i++) {
            dashLevel.push(indexList[i]);
          }
          //결국 1-2-4 이런 형태로 저장됨.
          dashLevel = dashLevel.join('-');

          //마지막에 생기는 엔터를 없애기 위함 //사실 굳이 없앨 필요는 없는데 저장공간을 아낀다고 치자.
          content = content.replace(/\n$/, '');
          //얘는 조금 전에 엔터를 하나 추가했기 때문에 하나 더 지워야 함.
          content = content.replace(/\n$/, '');

          if (docInfo.content.replace(/\n/g, '').trim() == '') {
            content = '';
          }

          docInfo.document[dashLevel + '|' + title] = content;
          return '';
        });

        //console.log(docInfo.content);

        if (docInfo.content.replace(/\n/g, '').trim() != '') {
          docInfo.document['content'] = docInfo.content;
        }

        resolve();
      }
    } else if (reason == 'save') {
      resolve();
    }
  });
}
//------------------------------------------------

//분류 문법 [#28기#]
//원래 가지고 있던 분류 리스트
var oldClassList = new Array();
var classList = new Array();

function classListFormat(classList, type) {
  for (var i in classList) {
    if (type == 0) {
      //serialize
      classList[i] = serialize('분류:' + classList[i]);
    } else if (type == 1) {
      //inv_serialize //콜론 앞에 때는 type
      classList[i] = inv_serialize(classList[i]).split(':').slice(1).join(':');
    } else if (type == 2) {
      //일반 문서 serialize
      classList[i] = serialize(classList[i]);
    } else if (type == 3) {
      //inv_serialize
      classList[i] = inv_serialize(classList[i]);
    }
  }

  return classList;
}

function classGrammar(reason) {

  return new Promise(resolve => {

    if (reason == 'load') {

      if (docInfo.highClass == undefined) {
        docInfo.highClass = [];
      }

      if (docInfo.highClass.length != 0) {
        if (docInfo.name != '분류:분류') {
          docInfo.content = '분류:';
        } else {
          docInfo.content = '<hr/>';
        }

        for (i in docInfo.highClass) {

          if (Number(i) + 1 == docInfo.highClass.length) {
            docInfo.content = docInfo.content.concat('&nbsp;<a title="분류:' + docInfo.highClass[i] + '"' +
              ' href="w/분류:' + docInfo.highClass[i] + '">' + docInfo.highClass[i] + '<\/a><hr/>');
          } else {
            docInfo.content = docInfo.content.concat('&nbsp;<a title="분류:' + docInfo.highClass[i] + '"' +
              ' href="w/분류:' + docInfo.highClass[i] + '">' + docInfo.highClass[i] + '<\/a>&nbsp;|');
          }
        }

      } else {
        docInfo.content = '<hr/>';
      }


      //console.log(docInfo.content);

      resolve();

    } else if (reason == 'make') {

      docInfo.highClass = [];

      docInfo.content = docInfo.content.replace(/(?<!\\)\[#(.+?)#](?!])(?:\n)?/g, function (match, content) {
        docInfo.highClass.push(content);
        return '';
      });

      //console.log('-------------------------------------------------------');
      //console.log(docInfo.highClass);
      //console.log('-------------------------------------------------------');

      if (docInfo.highClass.length == 0 && docInfo.name != '분류:분류') {
        docInfo.highClass.push('미분류');
      }

      resolve();


    } else if (reason == 'edit') {

      docInfo.lastClass = docInfo.highClass;

      docInfo.content = '';

      for (i in docInfo.highClass) {
        if (Number(i) + 1 == docInfo.highClass.length) {
          docInfo.content = docInfo.content.concat('[#' + docInfo.highClass[i] + '#]\n');
        } else {
          docInfo.content = docInfo.content.concat('[#' + docInfo.highClass[i] + '#]\n');
        }
      }

      resolve();

    } else if (reason == 'save') {

      let addedClass = [];
      let removedClass = (docInfo.lastClass || []);

      for (i in docInfo.highClass) {
        if (removedClass.indexOf(docInfo.highClass[i]) != -1) {
          //원래 분류와 현재 분류에 존재 => 변하지 않음.
          removedClass.splice(removedClass.indexOf(docInfo.highClass[i]), 1);
        } else {
          //원래 분류에는 없지만 현재 분류에는 존재 => 새로 추가됨.
          addedClass.push(docInfo.highClass[i]);
        }
      }

      //원래 분류에 남아있는 항목 => 제거된 분류 => removedClass

      //console.log('-------------------------------------------------------');
      //console.log(addedClass);
      //console.log(removedClass);
      //console.log('-------------------------------------------------------');

      docInfo.addedClass = addedClass;
      docInfo.removedClass = removedClass;

      resolve();
    }
  });
}

function makeClassContents(lowClassList, lowDocList, className) {

  return new Promise(resolve => {

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
    //사용자 문서 내용
    var classUserContent = '';

    var classDocList = [];
    var classUserList = [];
    var userGisuList = [];
    var classWikiList = [];
    var classFrameList = [];
    var classFileList = [];

    if (lowClassList == undefined) {
      lowClassList = [];
    }

    if (lowDocList == undefined) {
      lowDocList = [];
    }



    for (i in lowDocList) {
      if (lowDocList[i].split(':')[0] == '전곽위키') {
        classWikiList.push(lowDocList[i].split(':')[1]);
      } else if (lowDocList[i].split(':')[0] == '파일') {
        classFileList.push(lowDocList[i].split(':')[1]);
      } else if (lowDocList[i].split(':')[0] == '틀') {
        classFrameList.push(lowDocList[i].split(':')[1]);
      } else if (lowDocList[i].split(':')[0] == '선생님' || lowDocList[i].split(':')[0].search(/기/) != -1) {
        classUserList.push(lowDocList[i].split(':')[1]);
        userGisuList.push(lowDocList[i].split(':')[0] + ':');
      } else {
        classDocList.push(lowDocList[i]);
      }
    }

    lowClassContent = '<h2>하위분류</h2>';
    classDocContent = '<h2>"' + className.split(':').pop() + '"(으)로 분류된 문서</h2>';
    classUserContent = '<h2>"' + className.split(':').pop() + '"(으)로 분류된 사용자</h2>';
    classWikiContent = '<h2>"' + className.split(':').pop() + '"(으)로 분류된 전곽위키</h2>';
    classFileContent = '<h2>"' + className.split(':').pop() + '"(으)로 분류된 파일</h2>';
    classFrameContent = '<h2>"' + className.split(':').pop() + '"(으)로 분류된 틀</h2>';

    if (lowClassList.length != 0) {
      lowClassList.sort();
      lowClassContent = classCho(lowClassList, '분류:', lowClassContent);
    } else {
      lowClassContent = '';
    }

    if (classDocList.length != 0) {
      classDocList.sort();
      classDocContent = classCho(classDocList, '', classDocContent);
    } else {
      classDocContent = '';
    }

    if (classUserList.length != 0) {
      classUserList.sort();
      classUserContent = classCho(classUserList, userGisuList, classUserContent);
    } else {
      classUserContent = '';
    }

    if (classWikiList.length != 0) {
      classWikiList.sort();
      classWikiContent = classCho(classWikiList, '전곽위키:', classWikiContent);
    } else {
      classWikiContent = '';
    }

    if (classFileList.length != 0) {
      classFileList.sort();
      classFileContent = classCho(classFileList, '파일:', classFileContent);
    } else {
      classFileContent = '';
    }

    if (classFrameList.length != 0) {
      classFrameList.sort();
      classFrameContent = classCho(classFrameList, '틀:', classFrameContent);
    } else {
      classFrameContent = '';
    }

    var finalClassContent = lowClassContent + classDocContent + classUserContent + classWikiContent + classFileContent + classFrameContent;

    docInfo.content = docInfo.content.concat(finalClassContent);

    resolve();
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
      if (choList.indexOf(sortedList[i].charAt(0)) != -1) {
        matchNum = choList.indexOf(sortedList[i].charAt(0));
      } else {
        matchNum = 0;
      }
      //console.log('it is Nothing => ' + choList[matchNum] + ':' + matchNum);
    }

    if (matchNum > nowNum) {
      if (nowNum == -1) {
        content = content.concat('<h4 style="margin: 1rem auto">' + choList[matchNum] + '</h4>');
      } else {
        content = content.concat(');\n<h4 style="margin: 1rem auto">' + choList[matchNum] + '</h4>');
      }
      nowNum = matchNum;
    }

    var realDocName = docList[notSortedList.indexOf(sortedList[i])];
    if (i == docList.length - 1) {
      if (typeof (doctype) == 'string') {
        content = content.concat("\n)<a title='" + doctype + realDocName + "' href='w/" + doctype + realDocName + "'>" + realDocName + "</a>);\n");
        return content;
      } else {
        content = content.concat("\n)<a title='" + doctype[i] + realDocName + "' href='w/" + doctype[i] + realDocName + "'>" + realDocName + "</a>);\n");
        return content;
      }
    } else {
      if (typeof (doctype) == 'string') {
        content = content.concat("\n)<a title='" + doctype + realDocName + "' href='w/" + doctype + realDocName + "'>" + realDocName + "</a>");
      } else {
        content = content.concat("\n)<a title='" + doctype[i] + realDocName + "' href='w/" + doctype[i] + realDocName + "'>" + realDocName + "</a>");
      }
    }
  }
}

function addDocToClass(docName, classList, classCount) {
  return new Promise((resolve, reject) => {
    if (classList.length <= classCount) {
      resolve();
    } else {
      console.log('분류:' + classList[classCount] + '에 ' + docName + '을 추가하는 중');
      firebase.firestore().collection(String(serialize('분류:' + classList[classCount]))).orderBy('history', 'desc').limit(1).get({
        source: 'server'
      }).then(field => {
        if (field.empty) {
          //새로운 분류 추가

          let keywords = makeKeyword('분류:' + classList[classCount]);
          saveFunction({
            state: 0,
            history: 0, //기존의 편집 횟수 -> 저장 시 +1
            byte: 0, //기존의 바이트 -> 저장 시 편집된 바이트
            changedByte: 0, //바뀐 바이트 양
            name: '분류:' + classList[classCount], //관리자(28기) //점이나 스페이스 바 그대로 가져옴.
            comment: '분류 생성',
            editorFull: userInfo.full, // 편집자의 이름과 기수
            editorNick: userInfo.nick, // 편집자의 닉네임 (꾸며진 이름/색깔같은 것/역사에 표시)
            time: new Date().getTime(),
            keyword: keywords, //키워드
            document: {
              content: ''
            }, //문서의 내용이 체계화되어 정리됨.
            highClass: ['미분류'], //상위 분류 배열
            lowClass: [],
            lowDoc: [docName] //하위 문서 배열
          }, 4).then(() => {
            //새로 생성한 분류를 미분류의 하위분류로 넣는다.
            addClassToClass('분류:' + classList[classCount], ['미분류'], 0).then(() => {
              addDocToClass(docName, classList, classCount + 1).then(() => {
                resolve();
              });
            });
          });


        } else {
          var classInfo = field.docs[0].data();

          if (classInfo.state == 2) {
            //삭제됐던 분류 문서
            let keywords = makeKeyword('분류:' + classList[classCount]);
            saveFunction({
              state: 2,
              history: classInfo.history, //기존의 편집 횟수 -> 저장 시 +1
              byte: 0, //기존의 바이트 -> 저장 시 편집된 바이트
              changedByte: 0, //바뀐 바이트 양
              name: '분류:' + classList[classCount], //관리자(28기) //점이나 스페이스 바 그대로 가져옴.
              comment: '분류 생성',
              editorFull: userInfo.full, // 편집자의 이름과 기수
              editorNick: userInfo.nick, // 편집자의 닉네임 (꾸며진 이름/색깔같은 것/역사에 표시)
              time: new Date().getTime(),
              keyword: keywords, //키워드
              document: {
                content: ''
              }, //문서의 내용이 체계화되어 정리됨.
              highClass: ['미분류'], //상위 분류 배열
              lowClass: [],
              lowDoc: [docName], //하위 문서 배열
              serial: classInfo.serial
            }, 4).then(() => {
              //새로 생성한 분류를 미분류의 하위분류로 넣는다.
              addClassToClass('분류:' + classList[classCount], ['미분류'], 0).then(() => {
                addDocToClass(docName, classList, classCount + 1).then(() => {
                  resolve();
                });
              });
            });
          } else {

            // if (classInfo.lowDoc == undefined) {
            //     classInfo.lowDoc = [];
            // }

            classInfo.name = '분류:' + classList[classCount];

            classInfo.highClass = classListFormat(classInfo.highClass, 1);
            classInfo.lowClass = classListFormat(classInfo.lowClass, 1) || [];
            classInfo.lowDoc = classListFormat(classInfo.lowDoc, 3) || [];

            //해당 분류 문서의 하위 문서에 '이 문서'를 추가.
            classInfo.lowDoc.push(docName);

            saveFunction(classInfo, 3).then(() => {
              addDocToClass(docName, classList, classCount + 1).then(() => {
                resolve();
              });
            });
          }
        }
      })
    }
  });
}

function addClassToClass(className, classList, classCount) {
  return new Promise((resolve, reject) => {
    if (classList.length <= classCount) {
      resolve();
    } else {
      console.log('분류:' + classList[classCount] + '에 ' + className + '을 추가하는 중');
      firebase.firestore().collection(String(serialize('분류:' + classList[classCount]))).orderBy('history', 'desc').limit(1).get({
        source: 'server'
      }).then(field => {
        if (field.empty) {
          //새로운 분류 추가
          let keywords = makeKeyword('분류:' + classList[classCount]);
          saveFunction({
            state: 0,
            history: 0, //기존의 편집 횟수 -> 저장 시 +1
            byte: 0, //기존의 바이트 -> 저장 시 편집된 바이트
            changedByte: 0, //바뀐 바이트 양
            name: '분류:' + classList[classCount], //관리자(28기) //점이나 스페이스 바 그대로 가져옴.
            comment: '분류 생성',
            editorFull: userInfo.full, // 편집자의 이름과 기수
            editorNick: userInfo.nick, // 편집자의 닉네임 (꾸며진 이름/색깔같은 것/역사에 표시)
            time: new Date().getTime(),
            keyword: keywords, //키워드
            document: {
              content: ''
            }, //문서의 내용이 체계화되어 정리됨.
            highClass: ['미분류'], //상위 분류 배열
            lowClass: [className.split(':').slice(1).join(':')], //하위 문서 배열
            lowDoc: []
          }, 4).then(() => {
            //새로 생성한 분류를 미분류의 하위분류로 넣는다.
            addClassToClass('분류:' + classList[classCount], ['미분류'], 0).then(() => {
              addClassToClass(className, classList, classCount + 1).then(() => {
                resolve();
              });
            });
          });
        } else {
          var classInfo = field.docs[0].data();

          if (classInfo.state == 2) {
            //삭제됐던 분류 문서
            let keywords = makeKeyword('분류:' + classList[classCount]);
            saveFunction({
              state: 2,
              history: classInfo.history, //기존의 편집 횟수 -> 저장 시 +1
              byte: 0, //기존의 바이트 -> 저장 시 편집된 바이트
              changedByte: 0, //바뀐 바이트 양
              name: '분류:' + classList[classCount], //관리자(28기) //점이나 스페이스 바 그대로 가져옴.
              comment: '분류 생성',
              editorFull: userInfo.full, // 편집자의 이름과 기수
              editorNick: userInfo.nick, // 편집자의 닉네임 (꾸며진 이름/색깔같은 것/역사에 표시)
              time: new Date().getTime(),
              keyword: keywords, //키워드
              document: {
                content: ''
              }, //문서의 내용이 체계화되어 정리됨.
              highClass: ['미분류'], //상위 분류 배열
              lowClass: [className.split(':').slice(1).join(':')], //하위 문서 배열
              lowDoc: [],
              serial: classInfo.serial
            }, 4).then(() => {
              //새로 생성한 분류를 미분류의 하위분류로 넣는다.
              addClassToClass('분류:' + classList[classCount], ['미분류'], 0).then(() => {
                addClassToClass(className, classList, classCount + 1).then(() => {
                  resolve();
                });
              });
            });
          } else {

            // if (classInfo.lowClass == undefined) {
            //     classInfo.lowClass = [];
            // }

            classInfo.name = '분류:' + classList[classCount];

            classInfo.highClass = classListFormat(classInfo.highClass, 1);
            classInfo.lowClass = classListFormat(classInfo.lowClass, 1) || [];
            classInfo.lowDoc = classListFormat(classInfo.lowDoc, 3) || [];

            //해당 분류 문서의 하위 분류에 '이 분류'를 추가.
            classInfo.lowClass.push(className.split(':').slice(1).join(':'));

            saveFunction(classInfo, 3).then(() => {
              addClassToClass(className, classList, classCount + 1).then(() => {
                resolve();
              });
            });
          }
        }
      })
    }
  });
}

function removeDocToClass(docName, classList, classCount) {
  return new Promise((resolve, reject) => {
    if (classList.length <= classCount) {
      resolve();
    } else {
      console.log('분류:' + classList[classCount] + '에서 ' + docName + '을 제거하는 중');
      firebase.firestore().collection(String(serialize('분류:' + classList[classCount]))).orderBy('history', 'desc').limit(1).get({
        source: 'server'
      }).then(field => {
        if (field.empty) {
          console.log('없을리가 없어!!');
        } else {

          var classInfo = field.docs[0].data();

          classInfo.name = '분류:' + classList[classCount];

          classInfo.highClass = classListFormat(classInfo.highClass, 1);
          classInfo.lowClass = classListFormat(classInfo.lowClass, 1) || [];
          classInfo.lowDoc = classListFormat(classInfo.lowDoc, 3) || [];

          //해당 분류 문서의 하위 문서에 '이 문서'를 제거.
          classInfo.lowDoc.splice(classInfo.lowDoc.indexOf(docName), 1);

          saveFunction(classInfo, 3).then(() => {

            console.log(classInfo.highClass);

            classInfo.highClass = classListFormat(classInfo.highClass, 1);
            classInfo.lowClass = classListFormat(classInfo.lowClass, 1) || [];
            classInfo.lowDoc = classListFormat(classInfo.lowDoc, 3) || [];

            console.log(classInfo.highClass);

            if (classInfo.lowDoc.length == 0 && classInfo.lowClass.length == 0) {
              //하위 문서와 하위 분류가 없다면 => 상위분류에서 이 분류 제거 => 이 분류 문서를 제거
              //이 분류 문서를 없애기
              deleteDoc('class', '분류:' + classList[classCount]).then(() => {

                console.log(classInfo.highClass);
                //삭제된 분류 문서의 상위 분류에서 이 분류 없애기
                removeClassToClass('분류:' + classList[classCount], classInfo.highClass, 0).then(() => {

                  console.log(classInfo.highClass);
                  //하던 일 계속하기
                  removeDocToClass(docName, classList, classCount + 1).then(() => {
                    resolve();
                  });
                })
              })

            } else {
              removeDocToClass(docName, classList, classCount + 1).then(() => {
                resolve();
              });
            }
          });
        }
      })
    }
  });
}

function removeClassToClass(className, classList, classCount) {
  return new Promise((resolve, reject) => {
    if (classList.length <= classCount) {
      resolve();
    } else if (className == '분류:미분류' && classList[classCount] == 1) {
      //분류:분류에서 분류:미분류를 지울수는 없다.
      console.log('\"분류:미분류\"는 \"분류:분류\"에 분류된다.');
      removeClassToClass(className, classList, classCount + 1).then(() => {
        resolve();
      });
    } else {
      console.log('분류:' + classList[classCount] + '에서 ' + className + '을 제거하는 중');
      firebase.firestore().collection(String(serialize('분류:' + classList[classCount]))).orderBy('history', 'desc').limit(1).get({
        source: 'server'
      }).then(field => {
        if (field.empty) {
          console.log('없을리가 없어!!');
        } else {

          var classInfo = field.docs[0].data();

          classInfo.name = '분류:' + classList[classCount];

          classInfo.highClass = classListFormat(classInfo.highClass, 1);
          classInfo.lowClass = classListFormat(classInfo.lowClass, 1) || [];
          classInfo.lowDoc = classListFormat(classInfo.lowDoc, 3) || [];

          //해당 분류 문서의 하위 문서에 '이 분류'를 제거.
          classInfo.lowClass.splice(classInfo.lowClass.indexOf(className.split(':').slice(1).join(':')), 1);

          saveFunction(classInfo, 3).then(() => {

            classInfo.highClass = classListFormat(classInfo.highClass, 1);
            classInfo.lowClass = classListFormat(classInfo.lowClass, 1) || [];
            classInfo.lowDoc = classListFormat(classInfo.lowDoc, 3) || [];

            if (classInfo.lowDoc.length == 0 && classInfo.lowClass.length == 0 && classList[classCount] != 2) {
              //하위 문서와 하위 분류가 없다면 => 상위분류에서 이 분류 제거 => 이 분류 문서를 제거
              //이 분류 문서를 없애기
              deleteDoc('class', '분류:' + classList[classCount]).then(() => {
                //삭제된 분류 문서의 상위 분류에서 이 분류 없애기
                removeClassToClass('분류:' + classList[classCount], classInfo.highClass, 0).then(() => {
                  //하던 일 계속하기
                  removeClassToClass(className, classList, classCount + 1).then(() => {
                    resolve();
                  });
                })
              })
            } else {

              removeClassToClass(className, classList, classCount + 1).then(() => {
                resolve();
              });

            }
          });
        }
      })
    }
  });
}

//인용문 문법
function quoteGrammar(reason) {
  return new Promise(resolve => {
    if (reason == 'load') {
      docInfo.content = docInfo.content.replace(/(?<!\\)\[>(?!>)((?:.|\n)+?)(?<!&lt;|<)(?:&lt;|<)]/g, '<blockquote class="smallBlockquote">$1</blockquote>');
      docInfo.content = docInfo.content.replace(/(?<!\\)\[>>(?!>)((?:.|\n)+?)(?<!&lt;|<)(?:&lt;|<)(?:&lt;|<)](?:\n)?/g, '<blockquote class="middleBlockquote"><em>$1</em></blockquote>');
      docInfo.content = docInfo.content.replace(/(?<!\\)\[>>>(?!>)((?:.|\n)+?)(?<!&lt;|<)(?:&lt;|<)(?:&lt;|<)(?:&lt;|<)](?:\n)?/g, '<blockquote class="bigBlockquote"><em>$1</em></blockquote>');
      resolve();

    } else if (reason == 'save') {
      docInfo.content = docInfo.content.replace(/(?<!\\)\[>(?!>)((?:.|\n)+?)(?<!&lt;|<)(?:&lt;|<)]/g, function (match, first) {
        addKeyword(first);
        return match;
      });
      resolve();
    }
  });
}

//버튼 문법 // 안씀 // 보류
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

//프로그래밍 언어 문법
function codeGrammar(reason) {
  return new Promise(resolve => {
    if (reason == 'load') {
      docInfo.content = docInfo.content.replace(/(?<!\\)\[코드\(((?:(?:.|\n)(?!\[.*?\())+?)\)\]/g, "<code>$1</code>");
      resolve();
    } else if (reason == 'save') {
      resolve();
    }
  });
}

//수식 문법
function mathGrammar(reason) {
  return new Promise(resolve => {
    if (reason == 'load') {
      docInfo.content = docInfo.content.replace(/(?<!\\)\[math\(((?:(?:.|\n)(?!\[.*?\())+?)\)\]/g, function (match, content) {
        return '$|' + content + '|$';
      });
      docInfo.content = docInfo.content.replace(/(?<!\\)\[Math\(((?:(?:.|\n)(?!\[.*?\())+?)\)\]\n?/g, function (match, content) {
        return '$$|' + content + '|$$';
      });

      resolve();

    } else if (reason == 'save') {
      resolve();
    }
  });
}

//틀 불러오기 문법

var oldFrameList = [];

function frameGrammar(reason) {
  return new Promise((resolve, reject) => {
    if (reason == 'load') {

      var frameMatchNum = (docInfo.content.match(/(?<!\\)\[틀\(((?:.|\n)+?)\)\]/g) || []).length;

      var frameNameList = [];

      var frameParaList = [];

      //replace 함수를 이용해 틀들의 이름만 받아온다.
      docInfo.content.replace(/(?<!\\)\[틀\(((?:.|\n)+?)\)\]/g, function (match, capture) {

        if (capture.search(/\|\?/) == -1) {
          frameNameList.push(capture);
          frameParaList.push(null);
          return match;
        } else {
          let paras = capture.split('|');
          frameNameList.push(paras[0]);
          paras = paras.slice(1).join('|');
          frameParaList.push(paras.split(/\|\?/));
          return match;
        }
      });

      // console.log(frameNameList);
      // console.log(frameParaList);

      showFrameLoop(frameNameList, frameParaList, frameMatchNum, 0).then(() => {
        resolve();
      });

    } else if (reason == 'edit') {
      docInfo.content.replace(/(?<!\\)\[틀\(((?:.|\n)+?)\)\]/g, function (match, capture) {
        docInfo.link['틀:' + encode(capture.split('|')[0])] = null;
        oldFrameList.push('틀:' + capture.split('|')[0]);
        return match;
      });
      resolve();
    } else if (reason == 'save') {
      var frameMatchNum = (docInfo.content.match(/(?<!\\)\[틀\(((?:.|\n)+?)\)\]/g) || []).length;

      var frameNameList = [];

      //replace 함수를 이용해 틀들의 이름만 받아온다.
      docInfo.content.replace(/(?<!\\)\[틀\(((?:.|\n)+?)\)\]/g, function (match, capture) {
        addKeyword(capture);
        docInfo.link['틀:' + encode(capture.split('|')[0])] = true;
        frameNameList.push(capture.split('|')[0]);
        return match;
      });

      findFrame(frameNameList, frameMatchNum, 0).then(() => {
        resolve();
      });
    }
  });
}

function showFrameLoop(frameNameList, frameParaList, frameMatchNum, frameLoopNum) {
  return new Promise((resolve, reject) => {
    if (frameMatchNum == frameLoopNum) {
      resolve();
    } else {

      firebase.firestore().collection(String(serialize('틀:' + frameNameList[frameLoopNum]))).orderBy('history', 'desc').limit(1).get().then(value => {

        if (value.empty) {
          //틀 문서가 존재하지 않는다면

          console.log('틀:' + frameNameList[frameLoopNum] + ' 문서가 존재하지 않습니다.');

          docInfo.content = docInfo.content.replace(/(?<!\\)\[틀\(((?:.|\n)+?)\)\](?!<\/span>)\n?/, function (match) {
            return '<span style="color: red;">' + match + '</span>';
          });

        } else if (value.docs[0].data().state == 0) {
          //틀 문서가 존재한다면
          if (frameParaList[frameLoopNum] == null) {
            docInfo.content = docInfo.content.replace(/(?<!\\)\[틀\(((?:.|\n)+?)\)\](?!<\/span>)\n?/, '<div class="frameDiv" id="틀:$1">' + value.docs[0].data().document.content + "<\/div>");
          } else {
            let content = value.docs[0].data().document.content;

            //틀 문서 내의 틀은 가져오지 않는다. 무한루프 방지.
            content = content.replace(/(?<!\\)\[틀\(((?:.|\n)+?)\)\](?!<\/span>)\n?/g, '');

            console.log(frameParaList);

            for (var i in frameParaList[frameLoopNum]) {
              let paraReg = new RegExp("(?<!\\\\){{" + frameParaList[frameLoopNum][i].split('=')[0] + "\\}}(?!;\n)", 'g');
              // console.log(paraReg);
              content = content.replace(paraReg, frameParaList[frameLoopNum][i].split('=')[1]);
              // console.log(content);
            }

            //입력 안하면 그냥 빈칸
            content = content.replace(/(?<!\\){{.+?}}(?!;\n)/g, ' ');

            console.log(content);

            docInfo.content = docInfo.content.replace(/(?<!\\)\[틀\(((?:.|\n)+?)\)\](?!<\/span>)\n?/, function (match, capture) {
              return '<div class="frameDiv" id="틀:' + capture.split('|')[0] + '">' + content + "<\/div>"
            });
          }


        } else {
          //틀 문서가 숨겨져 있거나 제거됐다면??
          console.log('틀:' + frameNameList[frameLoopNum] + ' 문서가 숨겨져 있거나 존재하지 않습니다.');

          docInfo.content = docInfo.content.replace(/(?<!\\)\[틀\(((?:.|\n)+?)\)\](?!<\/span>)\n?/, function (match) {
            return '<span style="color: red;">' + match + '</span>';
          });
        }

        showFrameLoop(frameNameList, frameParaList, frameMatchNum, frameLoopNum + 1).then(() => {
          resolve();
        });
      });
    }
  });
}

//틀 문서의 존재 여부 함수
function findFrame(frameNameList, matchNum, loopNum) {
  return new Promise((resolve, reject) => {
    //console.log('matchNum => ' + matchNum);
    //console.log('loopNum => ' + loopNum);
    if (loopNum == matchNum) {
      resolve();
    } else {
      firebase.firestore().collection(String(serialize('틀:' + frameNameList[loopNum]))).orderBy('history', 'desc').limit(1).get({
        source: 'server'
      }).then(value => {
        //console.log(value);
        if (value.empty) {
          // alert('틀:' + frameNameList[loopNum] + ' 문서가 존재하지 않습니다.');
          resolve();

        } else if (value.docs[0].data().state == 1) {
          // alert('틀:' + frameNameList[loopNum] + ' 문서가 숨김 처리되어 있습니다.');
          resolve();

        } else if (value.docs[0].data().level > userInfo.level && oldFrameList.indexOf(value.docs[0].data().name) == -1) {
          alert('틀:' + frameNameList[loopNum] + ' 문서를 사용하기에는 권한이 부족합니다.\n필요권한: ' + value.docs[0].data().level);
          loading(false);
          reject();

        } else if (value.docs[0].data().state == 2) {
          // alert('틀:' + frameNameList[loopNum] + ' 문서가 존재하지 않습니다.');
          resolve();

        } else {
          findFrame(frameNameList, matchNum, loopNum + 1).then(function () {
            resolve();
          });
        }
      });
    }
  });
}

//네임카드 문법
function cardGrammar(reason) {
  return new Promise((resolve) => {
    if (reason == 'load') {
      docInfo.content = docInfo.content.replace(/(?<!\\)\[카드\(([^|]*?)\|([^|]+?)\)\]\n?/g, '<div class="card" style="$1">$2</div>');
      resolve();
    } else if (reason == 'save') {
      resolve();
    }
  });
}


//키워드 받아오기
var keywordObject = {};

function addKeyword(keyword) {
  //console.log(keyword);
  keyword = keyword.replace(/&lt;/g, '<');
  let keywordList = keyword.split(/(?:<|>| |\(|\)|\[|\]|{|}|\||\.|\/|#|\$|:|\?|,|\?|!|\n|\+|-|=|'|"|_)/g);

  for (let i = 0; i < keywordList.length; i++) {
    if (keywordList[i].length >= 1 && keywordList[i].search(/\\/g) == -1) {
      if (keywordObject[keywordList[i]] != undefined) {
        let count = keywordObject[keywordList[i]];
        keywordObject[keywordList[i]] = count + 1;
      } else {
        keywordObject[keywordList[i]] = 1;
      }
    }
  }

  //console.log(keywordObject);
}

function makeKeyword(word) {
  word = word.replace(/&lt;/g, '<');
  let keywordList = word.split(/(?:<|>| |\(|\)|\[|\]|{|}|\||\.|\/|#|\$|:|\?|,|\?|!|\n|\+|-|=|'|"|_)/g);

  let keywords = {}

  for (let i = 0; i < keywordList.length; i++) {
    keywords[keywordList[i]] = 1;
  }

  return keywords;
}

function grammar(reason, info) {
  return new Promise(resolve => {

    var temporaryInfo = docInfo;

    if (info != undefined) {
      docInfo = info;
    }

    if (reason == 'load') {

      //docInfo.content = docInfo.content.replace(/&#39;/g, '\'');
      //docInfo.content = docInfo.content.replace(/&#34;/g, '\"');
      //docInfo.content = docInfo.content.replace(/</g, '&lt;');
      //docInfo.content = docInfo.content.replace(/&gt;/g, '>');

    } else if (reason == 'save') {

      //키워드 초기화
      keywordObject = {};

      if (docInfo.content.search(/</) != -1) {
        if (userInfo.level >= 20) {
          // var adminSetting = prompt('0. 기본 세팅\n1. 자바스크립트 허용');
          var adminSetting = 0;

          if (adminSetting == 1) {
            //자바스크립트를 사용한다.
          } else {
            //기본 세팅
            docInfo.content = docInfo.content.replace(/</g, '&lt;');
          }
        } else {
          docInfo.content = docInfo.content.replace(/</g, '&lt;');
        }
      }

    }

    if (reason == 'edit') {

      docInfo.content = docInfo.content.replace(/&lt;/g, '<');

      docInfo.link = {};

      anchorGrammar(reason).then(() => {
        frameGrammar(reason).then(() => {
          imageGrammar(reason).then(() => {
            resolve();
          })
        });
      })

    } else {

      frameGrammar(reason).then(() => {

        tableGrammar(reason).then(() => {

          //console.log(docInfo.content);
          listGrammar(reason).then(() => {
            //console.log(docInfo.content);
            anchorGrammar(reason).then(() => {


              textGrammar(reason).then(() => {


                //console.log(text);


                imageGrammar(reason).then(() => {

                  mathGrammar(reason).then(() => {
                    //console.log(text);
                    quoteGrammar(reason).then(() => {
                      //console.log(text);
                      spanGrammar(reason).then(() => {

                        gitaGrammar(reason).then(() => {
                          //console.log(text);
                          codeGrammar(reason).then(() => {
                            //console.log(text);

                            cardGrammar(reason).then(() => {

                              //console.log(text);
                              noteGrammar(reason).then(() => {

                                if (reason == 'load') {

                                  //console.log(docInfo);
                                  noGrammar(reason);
                                  //console.log(docInfo);

                                  if (docInfo.type == 'class') {
                                    docInfo.content = docInfo.content.replace(/<\/h4>\n/g, '</h4>');
                                  }

                                  docInfo.content = docInfo.content.replace(/\n/g, '<br>');


                                }

                                let newInfo = docInfo;
                                docInfo = temporaryInfo;

                                if (info != undefined) {
                                  resolve(newInfo);
                                } else {
                                  resolve();
                                }

                              });
                            })
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
    }




    /*        if ((errNum = (text.match(/<ul/g) || []).length - (text.match(/<\/ul>/g) || []).length) != 0) {
                alert('순서 없는 리스트 문법에 ' + errNum + '개의 오류가 있습니다!');
            }

            if ((errNum = (text.match(/<ol/g) || []).length - (text.match(/<\/ol>/g) || []).length) != 0) {
                alert('순서 있는 리스트 문법에 ' + errNum + '개의 오류가 있습니다!');
            }*/

  });
}


function noGrammar(reason) {
  if (reason == 'load') {

    //console.log('noGrammar');

    //console.log(docInfo);

    docInfo.content = docInfo.content.replace(/\\\[\[/g, "[[");
    docInfo.content = docInfo.content.replace(/\\\["/g, "[\"");
    docInfo.content = docInfo.content.replace(/\\\[\//g, "[/");
    docInfo.content = docInfo.content.replace(/\\\['/g, "[\'");
    docInfo.content = docInfo.content.replace(/\\\[_/g, "[_");
    docInfo.content = docInfo.content.replace(/\\{{/g, "{{");
    docInfo.content = docInfo.content.replace(/\\:](?:(?!:)|(?=:]))/g, ":]");
    docInfo.content = docInfo.content.replace(/\\\[\)/g, "[)");
    docInfo.content = docInfo.content.replace(/\\---/g, "---");
    docInfo.content = docInfo.content.replace(/\\\[\+/g, "[+");
    docInfo.content = docInfo.content.replace(/\\\[-/g, "[-");
    docInfo.content = docInfo.content.replace(/\\\[\{/g, "[{");
    docInfo.content = docInfo.content.replace(/\\\[#/g, "[#");
    docInfo.content = docInfo.content.replace(/\\\[>(?!>)/g, "[>");
    docInfo.content = docInfo.content.replace(/\\\[>>(?!>)/g, "[>>");
    docInfo.content = docInfo.content.replace(/\\\[>>>(?!>)/g, "[>>>");
    docInfo.content = docInfo.content.replace(/\\\[코드\(/g, "[코드(");
    docInfo.content = docInfo.content.replace(/\\\[math\(/g, "[math(");
    docInfo.content = docInfo.content.replace(/\\\[Math\(/g, "[Math(");
    docInfo.content = docInfo.content.replace(/\\\[카드\(/g, "[카드(");
    docInfo.content = docInfo.content.replace(/\\\[틀\(/g, "[틀(");
    docInfo.content = docInfo.content.replace(/(\n|>)\\( *)(\)|\})/g, function (match, c1, c2, c3) {
      var space = c2.split(' ');
      var newSpace = '';
      for (i in space) {
        newSpace = newSpace + '&nbsp;';
      }
      return c1 + newSpace + c3;
    });
    docInfo.content = docInfo.content.replace(/\\(=+])/g, function (match, capture) {
      return capture;
    });
    docInfo.content = docInfo.content.replace(/(\n|>)\\\]/g, function (match, capture) {
      return capture + ']';
    });
  }
}


var isClicked = false;

function saveBtn() {

  if (isClicked) {
    //console.log('다중클릭 하지마요');
  } else {
    isClicked = true;


    checkAcl(docInfo.name).then(() => {
      checkLevel().then(() => {

        var editPossible = true;

        if (userInfo.level == 0) {

          alert('로그인 후 문서를 편집 및 생성할 수 있습니다.');
          editPossible = false;
          isClicked = false;

        } else if (docInfo.state == 1) {

          alert('숨겨진 문서입니다. 편집이 불가합니다.');
          editPossible = false;
          isClicked = false;

        } else if (userInfo.full == docInfo.name) {

          editPossible = true;

        } else if (userInfo.level < aclInfo.edit && docInfo.history != 0) {

          alert('권한이 부족하여 문서를 편집할 수 없습니다.');
          editPossible = false;
          isClicked = false;

        } else if (userInfo.level < aclInfo.edit && (docInfo.history == 0 || docInfo.state == 2)) {

          alert('권한이 부족하여 문서를 생성할 수 없습니다.');
          editPossible = false;
          isClicked = false;

        } else if (docInfo.type == 'class' && (docInfo.history == 0 || docInfo.state == 2)) {

          alert('분류 문서는 직접적으로 생성할 수 없습니다.');
          editPossible = false;
          isClicked = false;

        } else if (docInfo.type == 'user' && (docInfo.history == 0 || docInfo.state == 2)) {

          alert('현재는 사용자 문서를 생성할 수 없습니다.');
          editPossible = false;
          isClicked = false;

        } else if (docInfo.type == 'user' && userInfo.private == true) {

          alert('먼저 본인 문서의 숨김을 해제한 뒤에 다른 사용자의 문서를 편집할 수 있습니다.');
          editPossible = false;
          isClicked = false;

        } else if (docInfo.type == 'user' && docInfo.history != 0 && docInfo.state != 2) {

          alert('현재는 사용자 문서를 편집할 수 없습니다.');
          editPossible = false;
          isClicked = false;

        } else if ((docInfo.history == 0 || docInfo.state == 2) && getByteLength($("#documentE").val()) < 200 && docInfo.type != 'frame') {
          if ($("#documentE").val().search(/\[넘겨주기\(.+?\)\]/) == -1) {
            alert('문서의 내용이 너무 짧습니다.');
            editPossible = false;
            isClicked = false;
          }
        }
        // else if ((docInfo.history != 0 || docInfo.state != 2) && userInfo.make < 2) {
        //     if (docInfo.history == 0 || docInfo.state == 2) {
        //         //새로운 문서 생성
        //     } else {
        //         alert('먼저 새로운 문서를 2개 이상 생성해야 편집이 가능합니다.');
        //         editPossible = false;
        //         isClicked = false;
        //     }
        // }

        if (editPossible) {

          if (confirm("저장하시겠습니까?\n\n문서를 저장하게 되면 당신이 기여한 내용을 CC-BY-NC-SA 2.0으로 배포하는 것과 주소만으로 출처를 밝히는 데에 동의하는 것으로 간주합니다. 동의는 철회할 수 없습니다.\n또한, 전곽위키의 규정을 확실하게 숙지하고 있다고 간주합니다.")) {



            firebase.firestore().collection(String(docInfo.serial)).orderBy('history', 'desc').limit(1).get({
              source: 'server'
            }).then(field => {
              var nowHistoryNum = 0;
              if (!field.empty) {
                nowHistoryNum = field.docs[0].data().history;
              }

              //console.log(nowHistoryNum);

              if (nowHistoryNum != docInfo.history) {
                //동시 편집함

                alert('다른 사용자가 먼저 편집하였습니다.\n수정한 내용을 따로 저장한 뒤 다시 편집 창을 열어주세요.\n자동병합 기능은 아직 지원하지 않습니다.');
              } else {

                loading(true);

                //저장 버튼을 다시 누를 수 있게 해줌.
                isClicked = false;
                //역사를 다시 불러옴
                isHistoryLoaded = false;
                //동시 편집 아님
                //var editTxt = $("#documentE").val();

                var comment = $('#commentInput').val().replace(/</g, '&lt;');

                if (comment == 'dltmxjdprm2') {
                  comment = '';
                  alert('Easter Egg 2');
                }

                docInfo.content = $("#documentE").val();

                docInfo.comment = comment;

                var t = new Date();

                docInfo.editorNick = userInfo.nick;
                docInfo.editorFull = userInfo.full;
                docInfo.time = t.getTime();

                if (docInfo.state == 2) {
                  serialNote[docInfo.name] = removeNote[docInfo.name];
                  inv_serialNote[removeNote[docInfo.name]] = docInfo.name;
                  docNote.push(docInfo.name);
                }

                docInfo.changedByte = getByteLength(docInfo.content) - docInfo.byte;
                docInfo.byte = getByteLength(docInfo.content);

                //keyword, 역링크 추가
                //문서 구조화
                grammar('save').then(() => {

                  mainGrammar('make').then(() => {
                    //변한 분류들 수정
                    mainGrammar('save').then(() => {

                      addKeyword(getDocName());

                      docInfo.keyword = keywordObject;

                      saveFunction(docInfo).then(() => {
                        reasonOfMove = '편집';
                        movePage(inv_serialize(docInfo.serial), '', '', 'w');
                      });
                    });
                  });
                });
              }
            });

          } else {
            isClicked = false;
          }
        }
      });
    });
  }
}

$('#previewBtn').off('click').on('click', function () {
  $('.preTxt').empty();

  docInfo.content = $("#documentE").val();

  //docInfo.content는 그대로 편집하는 내용이어야 하기 때문에 일시적으로 저장해 두었다가 복구.
  var temporaryContent = docInfo.content;

  if (docInfo.content.search(/</) != -1) {
    if (userInfo.level >= 20) {
      // var adminSetting = prompt('0. 기본 세팅\n1. 자바스크립트 허용');
      var adminSetting = 0;

      if (adminSetting == 1) {
        //자바스크립트를 사용한다.
      } else {
        //기본 세팅
        docInfo.content = docInfo.content.replace(/</g, '&lt;');
      }
    } else {
      docInfo.content = docInfo.content.replace(/</g, '&lt;');
    }
  }
  mainGrammar('make').then(() => {
    mainGrammar('load').then(() => {
      grammar('load').then(() => {

        makeIndexList().then(indexTxt => {

          if (indexTxt != '<div id="index" class="whiteBlock"></div>') {
            docInfo.content = docInfo.content.split('<hr/>');
            docInfo.content[1] = indexTxt + docInfo.content[1];
            docInfo.content = docInfo.content.join('<hr/>');
          }

          //console.log(docInfo.content);
          $('.preTxt').html(docInfo.content);
          //$('.preTxt').append(text.replace(/\\\[넘겨주기\((.+?)\)\]/g, '[넘겨주기($1)]'));
          addNoteBubble();
          addAnchorEventListener();
          addParagraphBtn();
          MathJax.typeset();

          docInfo.content = temporaryContent;
        });
      });
    });
  });
});

function redirectGrammar(reason) {
  return new Promise((resolve, reject) => {
    if (reason == 'load') {
      if (docInfo.redirect != undefined && movePoint.question == '' && movePoint.type != 'e') {

        movePage(docInfo.redirect, '', 'from=' + docInfo.name, 'w');

      } else if (movePoint.question == 'doc=.') {
        movePage(docInfo.redirect, '', 'from=' + docInfo.name, 'w');
      } else {

        resolve();

      }

    } else if (reason == 'edit') {
      resolve();
    } else if (reason == 'make') {
      resolve();
    } else if (reason == 'save') {
      if (docInfo.content.match(/(?<!\\)\[넘겨주기\((.+?)\)\]/) != null) {
        docInfo.redirect = docInfo.content.match(/(?<!\\)\[넘겨주기\((.+?)\)\]/)[1];
        resolve();
      } else {
        delete docInfo.redirect;
        resolve();
      }
    }
  });
}

//class와 index를 결합하여 docInfo.content를 작성한다.
function mainGrammar(reason, info) {
  return new Promise((resolve, reject) => {

    var temporaryInfo = docInfo;

    if (info != undefined) {
      docInfo = info;
    }

    redirectGrammar(reason).then(() => {
      classGrammar(reason).then(() => {
        indexGrammar(reason).then(() => {


          var newInfo = docInfo;
          docInfo = temporaryInfo;

          if (info != undefined) {
            resolve(newInfo);
          } else {
            resolve();
          }
        })
      });
    });
  });
}