<?
	require_once("_conn.php");
	$json = file_get_contents('php://input');
	$obj = json_decode($json,true);
	$part = $obj['part'];
 	
 	$res = array();
 	$res['part'] = $part;
	$res['flag'] = 'fail';
	$res['msg'] = 'Please try again!';
	$res['res'] = '';

	if ($part.'' == 'login'){
		$userid = $obj['userid'];
		$userpw = $obj['userpw'];
		$sql = "SELECT * FROM tbl_users WHERE userid = '$userid' AND userpw = '$userpw'";
		$check = mysqli_fetch_assoc(mysqli_query($db,$sql));	
		 
		if(isset($check)){
			$res['flag'] = 'success';
			$res['sql'] = $sql;
			$res['msg'] = 'Login success';
			$res['res'] = $check;
		 
		 }else{
			$res['flag'] = 'fail';
			$res['sql'] = $sql;
			$res['msg'] = 'Login Fail! LoginID or password incorrect.';
			$res['res'] = '';
		 }

	}else if ($part.'' == 'signup'){
		$userid = $obj['userid'];
		$userpw = $obj['userpw'];
		$displayName = $obj['displayName'];

		$sql = "SELECT * FROM tbl_users WHERE userid = '$userid' OR displayName = '$displayName' ";
		$check = mysqli_fetch_assoc(mysqli_query($db,$sql));
		if(!isset($check)){
			$sql2 = "INSERT INTO `tbl_users` (`userid`, `userpw`, `displayName`) VALUES ('{$userid}','{$userpw}', '{$displayName}')";
			$checkInsert = mysqli_query($db,$sql2);

			if ($checkInsert){
				$res['flag'] = 'success';
				$res['sql2'] = $sql2;
				$res['msg'] = 'Account created.';
				$res['res'] = array("userid"=>$userid, "userpw"=>$userpw);
			}else{
				$res['flag'] = 'fail';
				$res['sql2'] = $sql2;
				$res['msg'] = 'Insert SQL error';
				$res['res'] = '';
			}

		}else{
			$res['flag'] = 'fail';
			$res['sql'] = $sql;
			$res['msg'] = 'Account already exist!';
			$res['res'] = '';
		}	 
	}

	echo json_encode($res);
?>