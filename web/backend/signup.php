<?php
// Connect to PostgreSQL database
$dbconn = pg_connect("host=localhost dbname=postgres user=postgres password=sai@2001")
    or die(json_encode(array('Message' => pg_last_error())));

// Check if the user has submitted the login form
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $body = file_get_contents("php://input");
    $POST = json_decode($body);
    $name = $POST->username;
    $email = $POST->email;
    $mobile = $POST->mobile;
    $password = $POST->password;
    // Check if the username already exists
    $sql = "SELECT * FROM userinfo1 WHERE username = '$name'";
    $result = pg_query($dbconn, $sql);

    // If the username already exists, display an error Message and exit
    if (pg_num_rows($result) > 0) {
        $data = array("Message"=>"already_exist");
        die(json_encode($data));
    }

    $sql = "INSERT INTO userinfo1 (username, email, mobile, password) VALUES ('$name','$email','$mobile','$password')";
    // Execute the SQL statement
    $result = pg_query($dbconn, $sql);

    // Check if the SQL statement was executed successfully
    if (!$result) {
        $data = array("Message"=>pg_last_error());
        die(json_encode($data));
    }
    $data = array("Message"=>"done");
    die(json_encode($data));
}
// Close the database connection
pg_close($dbconn);
?>
