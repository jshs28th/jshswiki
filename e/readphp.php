<?php

$title = $_POST["title"];
$n =-1;

$txt = fopen("../w/".$title.".txt", 'r');

    while(!feof($txt)) {

        fgets($txt);
        $n += 1;
    }

$num = $n/2;

echo $num;
echo "\n";

rewind($txt);

for ($i = 1; $i < $n; $i++) {

    fgets($txt);
}

fscanf($txt, "%[^\n]", $document);

echo $document;

//time, name, byte...
echo "\n";
echo fgets($txt);

?>