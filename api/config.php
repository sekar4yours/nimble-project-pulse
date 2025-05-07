
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// For preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Load environment variables
$env = parse_ini_file('.env');

// Database connection
$host = $env['DB_HOST'] ?? 'localhost';
$dbname = $env['DB_NAME'] ?? 'project_pulse';
$username = $env['DB_USER'] ?? 'root';
$password = $env['DB_PASSWORD'] ?? '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode([
        "success" => false,
        "message" => "Database connection failed: " . $e->getMessage()
    ]));
}

// Helper functions
function getRequestData() {
    $jsonData = file_get_contents("php://input");
    return json_decode($jsonData, true);
}

function generateToken($userId) {
    // In a real app, use a proper JWT library
    $payload = [
        "user_id" => $userId,
        "exp" => time() + 3600 // 1 hour expiration
    ];
    return base64_encode(json_encode($payload));
}

function validateToken($token) {
    // In a real app, use a proper JWT library for verification
    if (!$token) return null;
    
    try {
        $payload = json_decode(base64_decode($token), true);
        
        if ($payload['exp'] < time()) {
            return null; // Token expired
        }
        
        return $payload['user_id'];
    } catch (Exception $e) {
        return null;
    }
}

// Get authenticated user ID from token
function getAuthUserId() {
    $headers = getallheaders();
    $auth = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (preg_match('/Bearer\s(\S+)/', $auth, $matches)) {
        $token = $matches[1];
        return validateToken($token);
    }
    
    return null;
}
