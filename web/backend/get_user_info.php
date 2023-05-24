<?php
// Connect to PostgreSQL database
$dbconn = pg_connect("host=localhost dbname=postgres user=postgres password=sai@2001")
    or die('Could not connect: ' . pg_last_error());

// Check if the user has submitted the login form
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $params = file_get_contents("php://input");
    $name = $_GET['username'];
    // Check if the username already exists
    $sql = "SELECT * FROM userinfo1 WHERE username = '$name'";
    $result = pg_query($dbconn, $sql);
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    $res = array();
    while( $row = pg_fetch_row($result)) {
        $item = array("email"=>$row[1],"mobile"=>$row[2],"liked_events"=>$row[4]);
        array_push($res,$item);
    }
    $data = array("Exist"=>$res);
    die(json_encode($data));
}
// Close the database connection
pg_close($dbconn);
?>
