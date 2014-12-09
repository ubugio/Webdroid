<?php
	header("Access-Control-Allow-Origin: *");

    $message_content = "{\"status\":\"ok\",\"updatetime\":\"".$_GET['updatetime']."\",\"id\":\"".$_GET['id']."\",\"ip\":\"".$_GET['ip']."\",\"port\":\"".$_GET['port']."\",\"socketport\":\"".$_GET['socket']."\"}";

    $channel_instance = new SaeChannel();
    $ret = $channel_instance->sendMessage($_GET['id'],$message_content);
    
    echo "{\"status\":\"ok\"}";
?>