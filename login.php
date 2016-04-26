<?php

    if(($_POST['login_user']=='admin') && ($_POST['login_pass']=='password')){
        echo 'true';
    }else{
        echo 'false';
    }
?>