<?php

$title = $_POST['title'];

$fp = fopen('allDoc.txt', 'ab');

fwrite($fp, ' '.$title);

fclose($fp);


?>