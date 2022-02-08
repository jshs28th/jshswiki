<?php $fp = fopen("allDoc.txt", "rb");
$size = filesize("allDoc.txt");
$num = rand(0, $size);
fseek($fp, $num);
fscanf($fp, "%s %s", $a, $name);
echo $name;?>