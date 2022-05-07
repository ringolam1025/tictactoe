<?
	$host = "localhost";
	$user = "root";
	$pw = "rR12345678";
	$db = "tictactoe";

	// Create connection
	$db = mysqli_connect($host, $user, $pw, $db);
	mysqli_set_charset($db,"utf8");