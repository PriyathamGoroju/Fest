<?php
// Connect to PostgreSQL database
$dbconn = pg_connect("host=localhost dbname=postgres user=postgres password=sai@2001")
    or die('Could not connect: ' . pg_last_error());

// Check if the user has submitted the login form
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $params = file_get_contents("php://input");
    $name = $_GET['username'];
    // Check if the username already exists
    $sql = "SELECT * FROM attendees WHERE username = '$name'";
    $result = pg_query($dbconn, $sql);
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    $res = array();
    while( $row = pg_fetch_row($result)) {
        $item = array("event"=>$row[1],"email"=>$row[2],"mobile"=>$row[3],"group_name"=>$row[4],"group_num"=>$row[5],"group_mem"=>$row[6],"timestamp"=>$row[7]);
        array_push($res,$item);
    }
    $data = array("Exist"=>$res);
    die(json_encode($data));
}
// Close the database connection
pg_close($dbconn);
?>
