<?php
$name = $_POST['from'];
$message_content = "{\"status\":\"waiting\",\"name\":\"".$name."\"}";

$channel = new SaeChannel();
$num = $channel->sendMessage($name, $message_content);
?>