$("#exitBtn").click(function () {

    if(confirm("편집을 취소하시겠습니까?")){

        location.href = "../w/" + $(".documentTitle").text().replace(/ /gi, "%20");

    }
});

//num 0은 불러오기, 1은 저장하기
function grammar(text, num) {

    if (num == 0) {

        var txt = [nogrammar(text, 0)];
        txt[1] = txt[0].replace(/<a href='..\/w\//g, "[[");
        txt[2] = txt[1].replace(/<\/td><td>/g, "||");
        txt[3] = txt[2].replace(/<h2 id="[0-9]*\."><a href="#index">[0-9]*\.<\/a>&nbsp/g, "[=");
        txt[4] = txt[3].replace(/<h3 id="[0-9]*\.[0-9]*\."><a href="#index">[0-9]*\.[0-9]*\.<\/a>&nbsp/g, "[==");
        txt[5] = txt[4].replace(/<h4 id="[0-9]*\.[0-9]*\.[0-9]*\."><a href="#index">[0-9]*\.[0-9]*\.[0-9]*\.<\/a>&nbsp/g, "[===");
        txt[6] = txt[5].replace(/<h5 id="[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*\."><a href="#index">[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*\.<\/a>&nbsp/g, "[====");
        txt[7] = txt[6].replace(/<\/a>/g, "]]");
        txt[8] = txt[7].replace(/<b>/g, "[\"");
        txt[9] = txt[8].replace(/<\/b>/g, "\"]");
        txt[10] = txt[9].replace(/<i>/g, "[/");
        txt[11] = txt[10].replace(/<\/i>/g, "/]");
        txt[12] = txt[11].replace(/<ins>/g, "[\'");
        txt[13] = txt[12].replace(/<\/ins>/g, "\']");
        txt[14] = txt[13].replace(/<del>/g, "[_");
        txt[15] = txt[14].replace(/<\/del>/g, "_]");
        txt[16] = txt[15].replace(/<br>/g, "\n");
        txt[17] = txt[16].replace(/<img alt="파일이 존재하지 않습니다." src='..\/src\/img\//g, "{{");
        txt[18] = txt[17].replace(/'\/>/g, "}}");
        txt[19] = txt[18].replace(/&nbsp&nbsp&nbsp&nbsp/g, ":]");
        txt[20] = txt[19].replace(/<ul style='list-style: disc !important'><li>/g, "[(");
        txt[21] = txt[20].replace(/<table><tr><td>/g, "[{");
        txt[22] = txt[21].replace(/<\/td><\/tr><tr><td>/g, "}{");
        txt[23] = txt[22].replace(/<\/td><\/tr><\/table>/g, "}]");
        txt[24] = txt[23].replace(/<span style='color:/g, "[;");
        txt[25] = txt[24].replace(/<\/span>/g, ";]");
        txt[26] = txt[25].replace(/'>/g, "|");
        txt[27] = txt[26].replace(/<\/li><li>/g, ")(");
        txt[28] = txt[27].replace(/<\/li><\/ul>/g, ")]");
        txt[29] = txt[28].replace(/<ol><li>/g, "{(");
        txt[30] = txt[29].replace(/<\/li><\/ol>/g, ")}");
        txt[31] = txt[30].replace(/<hr>/g, "---");
        txt[32] = txt[31].replace(/<sup>/g, "[+");
        txt[33] = txt[32].replace(/<\/sup>/g, "+]");
        txt[34] = txt[33].replace(/<sub>/g, "[-");
        txt[35] = txt[34].replace(/<\/sub>/g, "-]");
        txt[36] = txt[35].replace(/<\/h5>/g, "====]\n");
        txt[37] = txt[36].replace(/<\/h4>/g, "===]\n");
        txt[38] = txt[37].replace(/<\/h3>/g, "==]\n");
        txt[39] = txt[38].replace(/<\/h2>/g, "=]\n");
        $(".inAndOut").text(txt[39]);


    } else if (num == 1) {

        var txt = [text.replace(/\[\[/g, "<a href='../w/")];
        txt[1] = txt[0].replace(/\|\|/g, "</td><td>");
        txt[2] = txt[1].replace(/---/g, "<hr>");
        txt[3] = txt[2].replace(/\["/g, "<b>");
        txt[4] = txt[3].replace(/"]/g, "</b>");
        txt[5] = txt[4].replace(/\[\//g, "<i>");
        txt[6] = txt[5].replace(/\/]/g, "</i>");
        txt[7] = txt[6].replace(/\['/g, "<ins>");
        txt[8] = txt[7].replace(/']/g, "</ins>");
        txt[9] = txt[8].replace(/\[_/g, "<del>");
        txt[10] = txt[9].replace(/_]/g, "</del>");
        txt[11] = txt[10].replace(/\n/g, "<br>");
        txt[12] = txt[11].replace(/{{/g, "<img alt=\"파일이 존재하지 않습니다.\" src='../src/img/");
        txt[13] = txt[12].replace(/}}/g, "'/>");
        txt[14] = txt[13].replace(/:]/g, "&nbsp&nbsp&nbsp&nbsp");
        txt[15] = txt[14].replace(/(?<!\|)\|(?!\|)/g, "'>");
        txt[16] = txt[15].replace(/\[{/g, "<table><tr><td>");
        txt[17] = txt[16].replace(/}{/g, "</td></tr><tr><td>");
        txt[18] = txt[17].replace(/}]/g, "</td></tr></table>");
        txt[19] = txt[18].replace(/\[;/g, "<span style='color:");
        txt[20] = txt[19].replace(/;]/g, "</span>");
        txt[21] = txt[20].replace(/]]/g, "</a>");
        txt[22] = txt[21].replace(/\)\(/g, "</li><li>");
        txt[23] = txt[22].replace(/\)]/g, "</li></ul>");
        txt[24] = txt[23].replace(/{\(/g, "<ol><li>");
        txt[25] = txt[24].replace(/\)}/g, "</li></ol>");
        txt[26] = txt[25].replace(/\[\(/g, "<ul style='list-style: disc !important'><li>");
        txt[27] = txt[26].replace(/\[\+/g, "<sup>");
        txt[28] = txt[27].replace(/\+]/g, "</sup>");
        txt[29] = txt[28].replace(/\[-/g, "<sub>");
        txt[30] = txt[29].replace(/-]/g, "</sub>");
        txt[31] = txt[30].replace(/====](?:<br>)?/g, "</h5>");
        txt[32] = txt[31].replace(/===](?:<br>)?/g, "</h4>");
        txt[33] = txt[32].replace(/==](?:<br>)?/g, "</h3>");
        txt[34] = txt[33].replace(/=](?:<br>)?/g, "</h2>");

        var index = 0;
        var a = 0;
        var b = 0;
        txt[35] = txt[34];

        while (index >= 0) {
            
            txt[34] = txt[35];
            index = parseInt((index + 1000000) / 1000000) * 1000000;
            txt[35] = txt[34].replace(/(?<!\\)\[={1}(?!=)/, "<h2 id=\"" + parseInt(index / 1000000) + ".\"><a href=\"#index\">" + parseInt(index / 1000000) + ".</a>&nbsp");

            if (txt[35] == txt[34]) {
                
                break;

            } else {
                a = txt[35].search(/(?<!\\)\[=(?!=)/);
                b = txt[35].search(/(?<!\\)\[==(?!=)/);
                while (a > b && b != -1 || a == -1) {

                    
                    txt[34] = txt[35];
                    index = parseInt((index + 10000) / 10000) * 10000;
                    txt[35] = txt[34].replace(/(?<!\\)\[={2}(?!=)/, "<h3 id=\"" + parseInt(index / 1000000) + "." + parseInt(index % 1000000 / 10000) + ".\"><a href=\"#index\">" + parseInt(index / 1000000) + "." + parseInt(index % 1000000 / 10000) + ".</a>&nbsp");

                    if (txt[35] == txt[34]) {
                        
                        break;

                    } else {
                        a = txt[35].search(/(?<!\\)\[==(?!=)/);
                        b = txt[35].search(/(?<!\\)\[===(?!=)/);
                        while (a > b && b != -1 || a == -1) {
                            
                            txt[34] = txt[35];
                            index = parseInt((index + 100) / 100) * 100;
                            txt[35] = txt[34].replace(/(?<!\\)\[={3}(?!=)/, "<h4 id=\"" + parseInt(index / 1000000) + "." + parseInt(index % 1000000 / 10000) + "." + parseInt(index % 10000 / 100) + ".\"><a href=\"#index\">" + parseInt(index / 1000000) + "." + parseInt(index % 1000000 / 10000) + "." + parseInt(index % 10000 / 100) + ".</a>&nbsp");

                            if (txt[35] == txt[34]) {
                                
                                break;

                            } else {
                                a = txt[35].search(/(?<!\\)\[===(?!=)/);
                                b = txt[35].search(/(?<!\\)\[====(?!=)/);
                                while (a > b && b != -1 || a == -1) {
                                    
                                    txt[34] = txt[35];
                                    index = index + 1;
                                    txt[35] = txt[34].replace(/(?<!\\)\[={4}(?!=)/, "<h5 id=\"" + parseInt(index / 1000000) + "." + parseInt(index % 1000000 / 10000) + "." + parseInt(index % 10000 / 100) + "." + parseInt(index % 100) + ".\"><a href=\"#index\">" + parseInt(index / 1000000) + "." + parseInt(index % 1000000 / 10000) + "." + parseInt(index % 10000 / 100) + "." + parseInt(index % 100) + ".</a>&nbsp");

                                    if (txt[35] == txt[34]) {
                                        
                                        break;

                                    }
                                }
                            }

                            a = txt[35].search(/(?<!\\)\[==(?!=)/);
                            b = txt[35].search(/(?<!\\)\[===(?!=)/);
                        }

                        a = txt[35].search(/(?<!\\)\[=(?!=)/);
                        b = txt[35].search(/(?<!\\)\[==(?!=)/);
                    }
                }
                a = 0;
                b = 0;
            }
        }
        txt[36] = nogrammar(txt[35], 1);
        return txt[36];

    }

}

function nogrammar(text, num) {

    if (num == 0) {

        var txt = [text.replace(/\[\[/g, "\\[[")];
        txt[1] = txt[0].replace(/\|\|/g, "\\||");
        txt[2] = txt[1].replace(/]]/g, "\\]]");
        txt[3] = txt[2].replace(/\["/g, "\\[\"");
        txt[4] = txt[3].replace(/"]/g, "\\\"]");
        txt[5] = txt[4].replace(/\[\//g, "\\[/");
        txt[6] = txt[5].replace(/\/]/g, "\\/]");
        txt[7] = txt[6].replace(/\['/g, "\\[\'");
        txt[8] = txt[7].replace(/']/g, "\\\']");
        txt[9] = txt[8].replace(/\[_/g, "\\[_");
        txt[10] = txt[9].replace(/_]/g, "\\_]");
        txt[11] = txt[10].replace(/{{/g, "\\{{");
        txt[12] = txt[11].replace(/}}/g, "\\}}");
        txt[13] = txt[12].replace(/:]/g, "\\:]");
        txt[14] = txt[13].replace(/(?<!\|)\|(?!\|)/g, "\\|");
        txt[15] = txt[14].replace(/\[{/g, "\\[{");
        txt[16] = txt[15].replace(/}{/g, "\\}{");
        txt[17] = txt[16].replace(/}]/g, "\\}]");
        txt[18] = txt[17].replace(/\[;/g, "\\[;");
        txt[19] = txt[18].replace(/;]/g, "\\;]");
        txt[20] = txt[19].replace(/\[\(/g, "\\[(");
        txt[21] = txt[20].replace(/\)\(/g, "\\)(");
        txt[22] = txt[21].replace(/\)]/g, "\\)]");
        txt[23] = txt[22].replace(/{\(/g, "\\{(");
        txt[24] = txt[23].replace(/\)}/g, "\\)}");
        txt[25] = txt[24].replace(/---/g, "\\---");
        txt[26] = txt[25].replace(/\[\+/g, "\\[+");
        txt[27] = txt[26].replace(/\+]/g, "\\+]");
        txt[28] = txt[27].replace(/\[-/g, "\\[-");
        txt[29] = txt[28].replace(/-]/g, "\\-]");
        txt[30] = txt[29].replace(/\[====(?!=)/g, "\\[====");
        txt[31] = txt[30].replace(/\[===(?!=)/g, "\\[===");
        txt[32] = txt[31].replace(/\[==(?!=)/g, "\\[==");
        txt[33] = txt[32].replace(/\[=(?!=)/g, "\\[=");
        txt[34] = txt[33].replace(/(?<!=)=]/g, "\\=]");
        txt[35] = txt[34].replace(/(?<!=)==]/g, "\\==]");
        txt[36] = txt[35].replace(/(?<!=)===]/g, "\\===]");
        txt[37] = txt[36].replace(/(?<!=)====]/g, "\\====]");
        return txt[37];


    } else if (num == 1) {

        var txt = [text.replace(/\\<a href='..\/w\//g, "[[")];
        txt[1] = txt[0].replace(/\\<\/td><td>/g, "||");
        txt[2] = txt[1].replace(/\\<\/a>/g, "]]");
        txt[3] = txt[2].replace(/\\<b>/g, "[\"");
        txt[4] = txt[3].replace(/\\<\/b>/g, "\"]");
        txt[5] = txt[4].replace(/\\<i>/g, "[/");
        txt[6] = txt[5].replace(/\\<\/i>/g, "/]");
        txt[7] = txt[6].replace(/\\<ins>/g, "[\'");
        txt[8] = txt[7].replace(/\\<\/ins>/g, "\']");
        txt[9] = txt[8].replace(/\\<del>/g, "[_");
        txt[10] = txt[9].replace(/\\<\/del>/g, "_]");
        txt[11] = txt[10].replace(/\\<img alt="파일이 존재하지 않습니다." src='..\/src\/img\//g, "{{");
        txt[12] = txt[11].replace(/\\'\/>/g, "}}");
        txt[13] = txt[12].replace(/\\&nbsp&nbsp&nbsp&nbsp/g, ":]");
        txt[14] = txt[13].replace(/\\'>/g, "|");
        txt[15] = txt[14].replace(/\\<table><tr><td>/g, "[{");
        txt[16] = txt[15].replace(/\\<\/td><\/tr><tr><td>/g, "}{");
        txt[17] = txt[16].replace(/\\<\/td><\/tr><\/table>/g, "}]");
        txt[18] = txt[17].replace(/\\<span style='color:/g, "[;");
        txt[19] = txt[18].replace(/\\<\/span>/g, ";]");
        txt[20] = txt[19].replace(/\\<ul style='list-style: disc !important'><li>/g, "[(");
        txt[21] = txt[20].replace(/\\<\/li><li>/g, ")(");
        txt[22] = txt[21].replace(/\\<\/li><\/ul>/g, ")]");
        txt[23] = txt[22].replace(/\\<ol><li>/g, "{(");
        txt[24] = txt[23].replace(/\\<\/li><\/ol>/g, ")}");
        txt[25] = txt[24].replace(/\\<hr>/g, "---");
        txt[26] = txt[25].replace(/\\<sup>/g, "[+");
        txt[27] = txt[26].replace(/\\<\/sup>/g, "+]");
        txt[28] = txt[27].replace(/\\<sub>/g, "[-");
        txt[29] = txt[28].replace(/\\<\/sub>/g, "-]");
        txt[30] = txt[29].replace(/\\\[=(?!=)/g, "[=");
        txt[31] = txt[30].replace(/\\\[==(?!=)/g, "[==");
        txt[32] = txt[31].replace(/\\\[===(?!=)/g, "[===");
        txt[33] = txt[32].replace(/\\\[====(?!=)/g, "[====");
        txt[34] = txt[33].replace(/\\<\/h2>/g, "=]<br>");
        txt[35] = txt[34].replace(/\\<\/h3>/g, "==]<br>");
        txt[36] = txt[35].replace(/\\<\/h4>/g, "===]<br>");
        txt[37] = txt[36].replace(/\\<\/h5>/g, "====]<br>");
        return txt[37];
    }

}

$("#saveBtn").click(function () {

    if (confirm("저장하시겠습니까?")) {

        var date = new Date();
        var text1 = $(".inAndOut").val();
        var text2 = grammar(text1, 1);
        var text3 = $("#historyNum").text().split("번");
        var text4 = ("\n" + text2 + "\n" + "--h" + text3[0] + "_" + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getHours() + "/" + date.getMinutes() + "/" + date.getSeconds() + "_익명_몇바이트----------<br>");
        var text5 = ($(".documentTitle").text() + "--h" + text3[0] + "_" + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getHours() + "/" + date.getMinutes() + "/" + date.getSeconds() + "_익명_몇바이트----------");

        $.post("log2php.php", { text: text5 }, function (data, status) { });

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