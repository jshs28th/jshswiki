$("#exitBtn").click(function () {

    location.href = "../w/" + $(".documentTitle").text().replace(/ /gi, "%20");
});

//num 0은 불러오기, 1은 저장하기
function grammar(text, num) {

    if (num == 0) {

        var txt = [nogrammar(text, 0)];

        txt[1] = txt[0].replace(/<a href='..\/w\//g, "[[");
        txt[2] = txt[1].replace(/'>/g, "|");
        txt[3] = txt[2].replace(/<\/a>/g, "]]");
        txt[4] = txt[3].replace(/<b>/g,     "[\"");
        txt[5] = txt[4].replace(/<\/b>/g,   "\"]");
        txt[6] = txt[5].replace(/<i>/g,     "[/");
        txt[7] = txt[6].replace(/<\/i>/g,   "/]");
        txt[8] = txt[7].replace(/<ins>/g,   "[\'");
        txt[9] = txt[8].replace(/<\/ins>/g, "\']");
        txt[10] = txt[9].replace(/<del>/g,   "[_");
        txt[11] = txt[10].replace(/<\/del>/g, "_]");
        txt[12] = txt[11].replace(/<br>/g, "\n");
        txt[13] = txt[12].replace(/<img alt="파일이 존재하지 않습니다." src="..\/src\/img\//g, "{{");
        txt[14] = txt[13].replace(/">/g, "}}");
        txt[15] = txt[14].replace(/&#9/g, ":]");
        $(".inAndOut").text(txt[15]);


    } else if (num == 1) {

        var txt = [text.replace(/\[\[/g, "<a href='../w/")];
        txt[1] = txt[0].replace(/\|/g, "'>");
        txt[2] = txt[1].replace(/\]\]/g, "</a>");
        txt[3] = txt[2].replace(/\["/g, "<b>");
        txt[4] = txt[3].replace(/"\]/g, "</b>");
        txt[5] = txt[4].replace(/\[\//g, "<i>");
        txt[6] = txt[5].replace(/\/\]/g, "</i>");
        txt[7] = txt[6].replace(/\['/g, "<ins>");
        txt[8] = txt[7].replace(/'\]/g, "</ins>");
        txt[9] = txt[8].replace(/\[_/g, "<del>");
        txt[10] = txt[9].replace(/_\]/g, "</del>");
        txt[11] = txt[10].replace(/\n/g, "<br>");
        txt[12] = txt[11].replace(/{{/g, "<img alt=\"파일이 존재하지 않습니다.\" src=\"../src/img/");
        txt[13] = txt[12].replace(/}}/g, "\">");
        txt[14] = txt[13].replace(/:]/g, "&#9");
        txt[15] = nogrammar(txt[14], 1);
        return txt[15];

    }

}

function nogrammar (text, num) {

    if(num==0){

        var txt = [text.replace(/\[\[/g, "\\[[")];
        txt[1] = txt[0].replace(/\|/g, "\\|");
        txt[2] = txt[1].replace(/\]\]/g, "\\]]");
        txt[3] = txt[2].replace(/\["/g, "\\[\"");
        txt[4] = txt[3].replace(/"\]/g, "\\\"]");
        txt[5] = txt[4].replace(/\[\//g,"\\[/");
        txt[6] = txt[5].replace(/\/\]/g,"\\/]");
        txt[7] = txt[6].replace(/\['/g, "\\[\'");
        txt[8] = txt[7].replace(/'\]/g, "\\\']");
        txt[9] = txt[8].replace(/\[_/g, "\\[_");
        txt[10] = txt[9].replace(/_\]/g, "\\_]");
        txt[11] = txt[10].replace(/{{/g, "\\{{");
        txt[12] = txt[11].replace(/}}/g, "\\}}");
        txt[13] = txt[12].replace(/:]/g, "\\:]");

        return txt[13];


    }else if (num ==1) {

        var txt = [text.replace(/\\<a href='..\/w\//g, "[[")];
        txt[1] = txt[0].replace(/\\'>/g, "|");
        txt[2] = txt[1].replace(/\\<\/a>/g, "]]");
        txt[3] = txt[2].replace(/\\<b>/g,     "[\"");
        txt[4] = txt[3].replace(/\\<\/b>/g,   "\"]");
        txt[5] = txt[4].replace(/\\<i>/g,     "[/");
        txt[6] = txt[5].replace(/\\<\/i>/g,   "/]");
        txt[7] = txt[6].replace(/\\<ins>/g,   "[\'");
        txt[8] = txt[7].replace(/\\<\/ins>/g, "\']");
        txt[9] = txt[8].replace(/\\<del>/g,   "[_");
        txt[10] = txt[9].replace(/\\<\/del>/g, "_]");
        txt[11] = txt[10].replace(/\\<img alt="파일이 존재하지 않습니다." src="..\/src\/img\//g, "{{");
        txt[12] = txt[11].replace(/\\">/g, "}}");
        txt[13] = txt[12].replace(/\\&#9/g, ":]");

        return txt[13];
    }

}

$("#saveBtn").click(function () {

    if(confirm("편집을 완료하시겠습니까?")){

    var text1 = $(".inAndOut").val();
    var text2 = grammar(text1, 1);
    var text3 = $("#historyNum").text().split("번");
    var text4 = ("\n" + text2 + "\n" + "--h" + text3[0] + "_" + Date.now() + "_익명_몇바이트----------<br>");
    var text5 = ($(".documentTitle").text() + "--h" + text3[0] + "_" + Date.now() + "_익명_몇바이트----------");

    $.post("log2php.php", {text: text5}, function(data, status) {    });
    
    $.post("editphp.php",

        { title: $(".documentTitle").text(), txt: text4 },

        function (data, status) {
            if (status == "success") {

                alert("정상적으로 수정되었습니다.");
                location.reload(true);
                location.href = "../w/" + $(".documentTitle").text();

            } else {

                alert("예기치 못한 오류가 발생했습니다. 다시 시도해 주세요.");
            }

        });

    }
});