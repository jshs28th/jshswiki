<?php
$num = $_POST['num'];
//0 => 파일 삭제
//1 => allDoc.txt에서 이름 삭제
if ($num == 0) {
    $fileRef = $_POST['ref'];
    unlink($fileRef);
} else if ($num == 1) {

    $docName = $_POST['docName'];
    $fp = fopen('allDoc.txt', 'a+b');
    rewind($fp);
    $old = fgets($fp);
    fclose($fp);
    $fp = fopen('allDoc.txt', 'w+b');

    echo 'old => '.$old.'<br>';

    $new = str_replace(' ' . $docName, '', $old);
    
    echo 'new => '.$new.'<br>';

    fwrite($fp, $new);
    fclose($fp);

}