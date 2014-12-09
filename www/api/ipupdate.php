<?php
header("Access-Control-Allow-Origin: *");
    $key = "Air-alpha-".uniqid();

	$save = array(
    	"ip" => $_GET['ip'],
    	"port" => $_GET['port'],
    	"socketport" => $_GET['socketport'],
    	"updatetime" => $_GET['updatetime']
    );
	$save = json_encode($save);
        

	$mmc=memcache_init();
    if($mmc==false)
        echo "{\"status\":\"fail\",\"data\":\"mc init failed\"}";
    else{
        memcache_set($mmc,$key,$save);
        
    }

echo "{\"status\":\"ok\",\"key\":\"".$key."\",\"mes\":\"".$_GET['ip']."/".$_GET['port']."/".$_GET['socketport']."/"."\"}";
?>