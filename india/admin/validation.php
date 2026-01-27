<?php

	include('include/db.php');

	session_start();

	if (isset($_POST['login'])) {

		$response=array();

		$username=$_POST['username'];

		$password=$_POST['password'];

		$type=$_POST['type'];

		$sql=mysqli_query($connect,"SELECT * FROM user where username='$username'");

		if (!mysqli_num_rows($sql)) {

			$responce['success']=0;

		}else{

			$result=mysqli_fetch_assoc($sql);

			if ($result['password']==$password && $result['type']==$type) {

				$responce['success']=1;

				$_SESSION['username']=$result['username'];

				$_SESSION['id']=$result['id'];

				$_SESSION['type']=$result['type'];



			}else{

				$responce['success']=0;

			}

		}

		echo json_encode($responce);

	}else{

		header('Location:index.php');

	}



?>