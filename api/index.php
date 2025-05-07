
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Welcome message for API root
echo json_encode([
    "success" => true,
    "message" => "Project Pulse API",
    "version" => "1.0.0",
    "endpoints" => [
        "/login.php" => "User authentication",
        "/signup.php" => "User registration",
        "/user_data.php" => "Get all user data after login",
        "/projects.php" => "Project management",
        "/tasks.php" => "Task management"
    ]
]);
