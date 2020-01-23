<?php

$document = $_POST['txt'];
$title = $_POST['title'];

$file = fopen($title.'.txt', 'a');

fwrite($file, $document);
fclose($file);

$file2 = fopen('../w/'.$title.'.txt', 'a');

fwrite($file2, $document);
fclose($file2);

?>