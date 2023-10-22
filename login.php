<?php
// Start session
session_start();

// Connect to the SQLite database
$DBSTRING = "sqlite:cse383.db";
include "sql.inc";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

	// Step 3 (Process logout POST variable and set session)
	if(isset($_POST['logout'])){
		$_SESSION['loggedin'] = 0;
		session_destroy;
		}else{

	// Step 1
	// Get the username and pasword from the $_POST variables
	$username = $_POST["username"];
	$password = $_POST["password"];

	// Prepare and execute the SQL query to validate the login credentials
	try {
		$DATA=GET_SQL("select * from auth where username=? and password=?",$username,$password);
		// Set session variable
		if (count($DATA) > 0) {
			$_SESSION['loggedin'] = 1;
			$_SESSION['username'] = $username;
			// user and password worked - set session variables
		}
		else {
			// No data retrieved - username/password not found
			// Set session variable to not logged in
			$_SESSION['loggedin'] = 0;
		}
	}
	catch  (Exception $e) {
		// Database Error
		// Set session variable to not logged in
		$_SESSION['loggedin'] = 0;
	}
		}
}
print "
<!DOCTYPE html>
<html lang='en'>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>Login</title>
<link href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3' crossorigin='anonymous'>

<!--  Include jQuery then bootstrap js.  Use the full version of jQuery (not slim) so it includes Ajax  -->
<script src='https://code.jquery.com/jquery-3.6.0.min.js' integrity='sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=' crossorigin='anonymous'></script>
<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js' integrity='sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p' crossorigin='anonymous'></script>
</head>
<body>";
if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin']) {
    //  Write the login form here  (2.a.i)
	print ("
	<h1>Login</h1>
	<form method='post' action='login.php'>
	<div class='form-group row mx-sm-3 mb-3' >
	<label for='username'>Username:</label>
	<div class='col-sm-6 text-center'>
	<input type='text' class='form-control' name='username' id='username' placeholder='Enter UserName'><br><br>
	</div>
	</div>
	<div class='form-group row mx-sm-3 mb-3'>
	<label for='password'>Password:</label>
	<div class='col-sm-6 text-center'>
	<input type='password' class='form-control' name='password' id='password'  placeholder='Enter Password'><br><br>
	<input type='submit' class='btn btn-primary' value='Login'>
	</div>
	</div>
</form>
");
}
else {
    //  Write the logged in secure data here (add a log out function) (2.b.i)
    print ("
	<h1>Welcome, ".$_SESSION['username']."!</h1>
	<h2> Here is a secure page </h2>
	<ul>
	<li><a href='option1.php'>Secure option 1</a></li>
	<li><a href='option2.php'>Secure option 2</a></li>
	<li><a href='option3.php'>Secure option 3</a></li>
	</ul>
		<form method='post' action='login.php'>
		<input type='submit' name='logout' value='Logout'>
		</form>
	");
}
?>
</body>
</html>

