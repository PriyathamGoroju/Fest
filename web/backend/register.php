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
    $event = $POST->event; 
    $name = $POST->username;
    $email = $POST->email;
    $mobile = $POST->mobile;
    $groupname = $POST->groupname;
    $groupnum = $POST->groupnum;
    $groupmem = $POST->groupmem;
    $time = $POST->timestamp;
    // Check if the username already exists
    $sql = "SELECT * FROM attendees WHERE username = '$name' and event_name = '$event'";
    $result = pg_query($dbconn, $sql);

    // If the username already exists, display an error Message and exit
    if (pg_num_rows($result) > 0) {
        $data = array("Message"=>"already_exist");
        die(json_encode($data));
    }

    $sql = "INSERT INTO attendees (username, email, mobile, event_name,group_name, group_num, group_mem, timestamp) VALUES ('$name','$email','$mobile','$event','$groupname','$groupnum','$groupmem','$time')";
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
