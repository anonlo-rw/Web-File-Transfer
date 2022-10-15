<?php
header("Access-Control-Allow-Origin:*");

$password = "password";
$attempt = $_GET["password"];

if ($attempt == $password) {
    // session_start();
    // $_SESSION["authentication"] = TRUE;
    echo "correct";

} else {
    echo "Invalid Password, try again";
}
?>