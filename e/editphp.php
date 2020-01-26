<?php

$document = $_POST['txt'];
$title = $_POST['title'];

$file = fopen('../w/'.$title.'.txt', 'a');

fwrite($file, $document);
fclose($file);

?>