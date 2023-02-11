<?php
header("Access-Control-Allow-Origin:*");

session_start();
if (!isset($_SESSION["authentication"])) {
    die("Permission Denied");
}
?>