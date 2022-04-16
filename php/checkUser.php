<?php 
//Name Check
if(!empty($_POST['name'])){ 
	$inGameName = $_POST['inGameName'];
	if(is_numeric($inGameName[0])){
		echo '<br/>The in-game name should begin with a letter.';
		exit();
	}
	//Database Connect
	require "dataBaseConnect.php";
	$q = $connexion->prepare('SELECT userId FROM users WHERE inGameName = ?');
	$q->execute(array($inGameName));
	$numRows = $q->rowCount();
	if($numRows > 0){
		echo 'In-game name already used !';
		exit();
	} else {
		echo 'success';
		exit();
	}
}
//Email Check
if(!empty($_POST['email'])){
	$email = $_POST['email'];
	//Check Email
	if(!filter_var($email, FILTER_VALIDATE_EMAIL)){  
		echo 'Invalid Email !';
		exit();
	}
	//Unique Email check
	require "dataBaseConnect.php";
	$q = $connexion->prepare('SELECT userId FROM users WHERE emailUtilisateur = ?');
	$q->execute(array($email));
	$numRows = $q->rowCount();
	if($numRows > 0){
		echo 'Email already used !';
		exit();
	} else {
		echo 'success';
		exit();
	}
}
//Check password
if(!empty($_POST['pass1_check']) && !empty($_POST['pass2_check'])){
	if (preg_match('#^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W){8,12}$#', $_POST['pass1_check'])) {
		echo 'Password too short / weak';
		exit();
	} else if($_POST['pass1_check'] == $_POST['pass2_check']){
		echo 'success';
		exit();
	} else {
		echo 'The two password are different';
		exit();
	}

}

//Register
if(isset($_POST['pseudo'])){
	require "dataBaseConnect.php";
	extract($_POST);

	$lastName=$_POST['LastName'];
	$firstName=$_POST['FirstName'];
	$inGameName=$_POST['Username'];
	$email=$_POST['email'];
	$pass1=$_POST['pass1'];
	$pass2=$_POST['pass2'];	

	$q = $connexion->prepare('SELECT userId FROM users WHERE inGameName = ?');
	$q->execute(array($inGameName));
	$gameName_check = $q->rowCount();
	
	$q = $connexion->prepare('SELECT userId FROM users WHERE email = ?');
	$q->execute(array($email));
	$email_check = $q->rowCount();

	if(empty($lastName) || empty($firstName) || empty($inGameName)||
	 empty($email)|| empty($pass1) || empty($pass2) ){
		echo "All informations havn't been filled.";
	} else if($pseudo_check > 0) {
		echo "In game name already used";
	} else if($email_check > 0) {
		echo "Email already used";
	}  else if(is_numeric($pseudo[0])) {
		echo "The in game name should begin with a letter.";
	}  else if($pass1 != $pass2) {
		echo "The password are not matching";
	} else {
		$hashed_password = password_hash($pass1, PASSWORD_DEFAULT);
		$request="INSERT INTO users
    						(lastName,firstName,inGameName,email,password) VALUES (
                            :lastName,
							:firstName,
							:inGameName,
							:email,
							:password)";
		$response = $connexion->prepare( $request );                  
		$response->execute(array(
			'lastName' => $lastName,
			'firstName' => $firstName,
			'inGameName' => $inGameName,
			'email' => $email,
			'password' => $hashed_password
		));
		echo "register_success";
		exit();
	}
	exit();
}
?>