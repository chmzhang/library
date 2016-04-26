<?php
header("Content-Type:text/html; charset=utf-8");
	switch($_POST['tab']){
	case 1:
		$json=file_get_contents('/library/info1.json');
		break;
	case 2:
		$json=file_get_contents('/library/info2.json');
		break;
	case 3:
    	$json=file_get_contents('/library/info3.json');
    	break;
    default:
    	break;
    }

    echo ($json);
?>