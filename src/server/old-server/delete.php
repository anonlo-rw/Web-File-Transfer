<?php
header("Access-Control-Allow-Origin:*");

$files = $_GET["files"];
if ($files == null) {
    die();
}

foreach (explode("|", $files) as $file) {
    unlink("../files/$file");
    unlink("../files/thumbnails/$file");
}
?>