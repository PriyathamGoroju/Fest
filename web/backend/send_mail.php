<?php
// Email variables
$to = "gadepaka.praneeth.19032@iitgoa.ac.in"; // recipient's email address
$subject = "Test Email"; // email subject
$message = "Hello, this is a test email!"; // email body
$headers = "From:saipraneethg2001@gmail.com"; // sender's email address

// Send email
if(mail($to, $subject, $message, $headers)){
    echo "Email sent successfully!";
} else {
    echo "Email sending failed.";
}
?>