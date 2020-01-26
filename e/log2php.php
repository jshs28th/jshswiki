<?php

$text = $_POST["text"];

$logFile = fopen("../src/js/log.txt", 'a');

fwrite($logFile, "\n".$text);

fclose($logFile);

?>