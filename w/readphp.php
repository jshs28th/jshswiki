<?php

$title = $_POST["title"];
$n =0;

$txt = fopen($title.".txt", 'r');

    while(!feof($txt)) {

        fgets($txt);
        $n += 1;
    }

$num = $n/2;

rewind($txt);

for ($i = 2; $i < $n; $i++) {

    fgets($txt);
}

//document
echo fgets($txt);

?>