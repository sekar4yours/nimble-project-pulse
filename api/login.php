
<?php
require_once 'config.php';

$data = getRequestData();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate required fields
    if (!isset($data['email']) || !isset($data['password'])) {
        echo json_encode([
            "success" => false, 
            "message" => "Email and password are required"
        ]);
        exit;
    }
    
    $email = $data['email'];
    $password = $data['password'];
    
    // Find user by email
    $stmt = $pdo->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user || !password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid email or password"
        ]);
        exit;
    }
    
    // Generate token
    $token = generateToken($user['id']);
    
    // Remove password from user data
    unset($user['password']);
    
    echo json_encode([
        "success" => true,
        "data" => [
            "token" => $token,
            "user" => $user
        ]
    ]);
}
