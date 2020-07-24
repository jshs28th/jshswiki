<?php

$className = $_POST['className'];
$docName = $_POST['docName'];
$num = $_POST['num'];
$fileRef = '../class/' . $className . '.txt';

$fp = fopen($fileRef, 'a+b');
rewind($fp);

$content = fgets($fp);//분류에 속하는 문서 이름들
//$highClass = fgets($fp);//상위 분류

//$list = explode(" ", $content);

fclose($fp);

//---------------------------------------

$fp = fopen($fileRef, 'w+b');

if ($num == 0) {
    //분류 추가
    fwrite($fp, $docName . ' '.$content);
    
} else if($num == 1){
    //분류 제거
    $newContent = str_replace($docName . ' ', '', $content);
    fwrite($fp, $newContent);

}

// else if ($num == 2) {
//     //상위 분류 추가
//     fwrite($fp, $content.$highClass.$docName . ' ');

// } else if ($num == 3) {
//     //상위 분류 제거
//     $newClass = str_replace($docName . ' ', '', $highClass);
//     fwrite($fp, $content.$newClass);

// }

fclose($fp);

//-----------------------------------------------

$fp = fopen($fileRef, 'a+b');
rewind($fp);
$content = fgets($fp);
//$highClass = fgets($fp);
//$list = explode(" ", $content);
echo $content;

fclose($fp);