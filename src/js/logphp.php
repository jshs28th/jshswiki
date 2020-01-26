<?php

$log = $_POST["name"];

$logTxt = fopen($log.".txt", 'r');

$n =0;

while(!feof($logTxt)) {

    fgets($logTxt);
    $n += 1;
}

rewind($logTxt);

for ($i = 10; $i < $n; $i++) {

    fgets($logTxt);
}

while(!feof($logTxt)) {

    echo fgets($logTxt);
    
}

fclose($logTxt);

?>