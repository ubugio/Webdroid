<?php
$name = $_POST['from'];
$message = $_POST['message'];

$channel = new SaeChannel();
$num = $channel->sendMessage($name, "You said: ".$message);
echo $message;
?>