<?php
$host = 'localhost';
$dbase = 'connect4';
$user="root";
$pwd="";
$charset = "utf-8";
$dns="mysql:host=$host;dbname=$dbase;charset=$charset";

try{
    $connexion = new pdo($dns,$user,$pwd);
}catch(Exception $e){
    die("Error".$e->getMessage());
}

?>