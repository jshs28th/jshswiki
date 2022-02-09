<?php
$time = $_POST['time'];
$name = $_POST['name'];
$serial = $_POST['serial'];
$content = $_POST['content'];

$fp = fopen($time.'backup.txt', 'a+t');

fwrite($fp, $serial.' | '.$name.chr(13).chr(10).chr(13).chr(10).$content.chr(13).chr(10).chr(13).chr(10).'----------------------------'.chr(13).chr(10).chr(13).chr(10));

// echo $gcn.' '.$name.' '.$code.chr(13).chr(10);

fclose($fp);