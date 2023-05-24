<?php
// Connect to PostgreSQL database
$dbconn = pg_connect("host=localhost dbname=postgres user=postgres password=sai@2001")
    or die('Could not connect: ' . pg_last_error());

// Check if the user has submitted the login form
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $params = file_get_contents("php://input");
    // Check if the username already exists
    $sql = "SELECT * FROM events";
    $result = pg_query($dbconn, $sql);
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    $res = array();
    while( $row = pg_fetch_row($result)) {
        $item = array("event_name"=>$row[0],"event_img"=>$row[1],"event_time"=>$row[2],"event_venue"=>$row[3],"event_price"=>$row[4],"event_likes"=>$row[5],"event_desc"=>$row[6]);
        array_push($res,$item);
    }
    $data = array("Exist"=>$res);
    die(json_encode($data));
}
// Close the database connection
pg_close($dbconn);
?>
