<?php
// Connect to PostgreSQL database
$dbconn = pg_connect("host=localhost dbname=postgres user=postgres password=sai@2001")
    or die('Could not connect: ' . pg_last_error());

// Check if the user has submitted the login form
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $params = file_get_contents("php://input");
    $name = $_GET['username'];
    $password = $_GET['password'];
    // Check if the username already exists
    $sql = "SELECT * FROM userinfo1 WHERE username = '$name' and password = '$password'";
    $result = pg_query($dbconn, $sql);
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    // If the username already exists, display an error message and exit
    if (pg_num_rows($result) > 0) {
        $data = array("Exist"=>"true");
        die(json_encode($data));
    }
    // Check if the SQL statement was executed successfully
    if (!$result) {
        $data = array("Exist"=>"false");
        die(json_encode($data));
    }
    $data = array("Exist"=>"false");
    die(json_encode($data));
}
// Close the database connection
pg_close($dbconn);
?>
