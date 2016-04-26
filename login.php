<?php
header('Access-Control-Allow-Origin:http://chmzhang.github.io/library/');
header('Access-Control-Allow-Methods:POST,GET');
    if(($_POST['login_user']=='admin') && ($_POST['login_pass']=='password')){
        echo 'true';
    }else{
        echo 'false';
    }
?>