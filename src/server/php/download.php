<?php
header("Access-Control-Allow-Origin:*");
ini_set("memory_limit", "5000M");

$files = filter_input(INPUT_GET, "files", FILTER_SANITIZE_SPECIAL_CHARS);
if ($files == null) {
    die();
}

if (count(explode(",", $files)) == 1) {
    header("Content-Type: application/octet-stream");
    header("Content-Transfer-Encoding: Binary");
    header("Content-disposition: attachment");
    readfile("../files/$files");
    die();
}

$zipFile = "../files.zip";
$zip = new ZipArchive;
$zip->open($zipFile, ZipArchive::CREATE);

chdir("../files/");
foreach (explode(",", $files) as $file) {
    $zip->addFile($file);

} $zip->close();

header("Content-Type: application/octet-stream");
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment");

readfile($zipFile);
unlink($zipFile);
?>