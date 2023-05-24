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
    $name = trim($POST->event_name,'"');
    $like = $POST->event_likes;
    // Check if the username already exists
    $sql = "SELECT * FROM events WHERE eventname = '$name'";
    $result = pg_query($dbconn, $sql);

    // If the username already exists, display an error Message and exit
    if (pg_num_rows($result) > 0) {
        $sql = "UPDATE events SET event_likes=$like where eventname='$name'";
        // Execute the SQL statement
        $result = pg_query($dbconn, $sql);

        // Check if the SQL statement was executed successfully
        if (!$result) {
            $data = array("Message"=>pg_last_error());
            die(json_encode($data));
        }
    }
    $data = array("Message"=>"done");
    die(json_encode($data));
}
// Close the database connection
pg_close($dbconn);
?>
