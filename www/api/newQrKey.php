<?php
header("Access-Control-Allow-Origin: *");
    $key = "Air-alpha-".uniqid();
    $channel = new SaeChannel();
    $url = $channel->createChannel($key,30);
	echo "{\"status\":\"ok\",\"key\":\"".$key."\",\"url\":\"".$url."\"}";
?>