<?php

if($_SERVER["REQUEST_METHOD"]=="POST"){

$name=$_POST['name'];
$doctor=$_POST['doctor'];

$file="appointments.txt";

$data="Patient: $name | Doctor: $doctor\n";

file_put_contents($file,$data,FILE_APPEND);

echo "Appointment Saved";
}

?>