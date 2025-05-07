
# Project Pulse - Task Management App

## Frontend

This React application uses a simple PHP backend API for authentication, project management, and task management. The frontend is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Backend API (PHP)

The backend consists of several PHP files that handle different aspects of the application. You'll need to create these files on your PHP server.

### API Structure

Place the following PHP files in an `/api` directory on your PHP server:

1. **config.php** - Database connection and common functions
2. **login.php** - Handles user login
3. **signup.php** - Handles user registration
4. **projects.php** - Manages projects (list, create, update)
5. **tasks.php** - Manages tasks (list, create, update)

### API Response Format

All API endpoints should return JSON responses in the following format:

```json
// Success response
{
  "success": true,
  "data": { /* response data */ }
}

// Error response
{
  "success": false,
  "message": "Error message"
}
```

### PHP Implementation

Here's a basic structure for each PHP file:

#### config.php

```php
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// For preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Database connection
$host = "localhost";
$dbname = "project_pulse";
$username = "your_db_username";
$password = "your_db_password";

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
```

#### login.php

```php
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
```

#### signup.php

```php
<?php
require_once 'config.php';

$data = getRequestData();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate required fields
    if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
        echo json_encode([
            "success" => false, 
            "message" => "Name, email, and password are required"
        ]);
        exit;
    }
    
    $name = $data['name'];
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Email already exists"
        ]);
        exit;
    }
    
    // Insert new user
    try {
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$name, $email, $password]);
        
        echo json_encode([
            "success" => true,
            "message" => "User registered successfully"
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Registration failed: " . $e->getMessage()
        ]);
    }
}
```

#### projects.php

```php
<?php
require_once 'config.php';

// Get projects
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = getAuthUserId();
    
    if (!$userId) {
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized"
        ]);
        exit;
    }
    
    // Get all projects for the user
    $stmt = $pdo->prepare("
        SELECT p.* FROM projects p
        JOIN project_members pm ON p.id = pm.project_id
        WHERE pm.user_id = ?
    ");
    $stmt->execute([$userId]);
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // For each project, get its members
    foreach ($projects as &$project) {
        $stmt = $pdo->prepare("
            SELECT u.id, u.name, u.email, pm.role
            FROM users u
            JOIN project_members pm ON u.id = pm.user_id
            WHERE pm.project_id = ?
        ");
        $stmt->execute([$project['id']]);
        $project['members'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    echo json_encode([
        "success" => true,
        "data" => $projects
    ]);
}

// Create project
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = getAuthUserId();
    $data = getRequestData();
    
    if (!$userId) {
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized"
        ]);
        exit;
    }
    
    if (!isset($data['name']) || !isset($data['description'])) {
        echo json_encode([
            "success" => false,
            "message" => "Project name and description are required"
        ]);
        exit;
    }
    
    try {
        $pdo->beginTransaction();
        
        // Create project
        $stmt = $pdo->prepare("INSERT INTO projects (name, description) VALUES (?, ?)");
        $stmt->execute([$data['name'], $data['description']]);
        $projectId = $pdo->lastInsertId();
        
        // Add creator as project member with 'owner' role
        $stmt = $pdo->prepare("INSERT INTO project_members (project_id, user_id, role) VALUES (?, ?, 'owner')");
        $stmt->execute([$projectId, $userId]);
        
        $pdo->commit();
        
        echo json_encode([
            "success" => true,
            "data" => [
                "id" => $projectId,
                "name" => $data['name'],
                "description" => $data['description'],
                "members" => [
                    [
                        "id" => $userId,
                        "role" => "owner"
                    ]
                ]
            ]
        ]);
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo json_encode([
            "success" => false,
            "message" => "Failed to create project: " . $e->getMessage()
        ]);
    }
}
```

#### tasks.php

```php
<?php
require_once 'config.php';

// Get tasks for a project
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = getAuthUserId();
    
    if (!$userId) {
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized"
        ]);
        exit;
    }
    
    // Check if project_id is provided
    if (!isset($_GET['project_id'])) {
        echo json_encode([
            "success" => false,
            "message" => "Project ID is required"
        ]);
        exit;
    }
    
    $projectId = $_GET['project_id'];
    
    // Check if user is a member of the project
    $stmt = $pdo->prepare("
        SELECT COUNT(*) FROM project_members
        WHERE project_id = ? AND user_id = ?
    ");
    $stmt->execute([$projectId, $userId]);
    if ($stmt->fetchColumn() === 0) {
        echo json_encode([
            "success" => false,
            "message" => "You don't have access to this project"
        ]);
        exit;
    }
    
    // Get tasks
    $stmt = $pdo->prepare("
        SELECT * FROM tasks
        WHERE project_id = ?
        ORDER BY status, priority DESC
    ");
    $stmt->execute([$projectId]);
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Group tasks by status
    $tasksByStatus = [
        'backlog' => [],
        'in-progress' => [],
        'done' => []
    ];
    
    foreach ($tasks as $task) {
        $status = $task['status'];
        if (!isset($tasksByStatus[$status])) {
            $status = 'backlog';
        }
        $tasksByStatus[$status][] = $task;
    }
    
    echo json_encode([
        "success" => true,
        "data" => $tasksByStatus
    ]);
}

// Create a task
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = getAuthUserId();
    $data = getRequestData();
    
    if (!$userId) {
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized"
        ]);
        exit;
    }
    
    // Validate required fields
    if (!isset($data['title']) || !isset($data['project_id']) || !isset($data['status'])) {
        echo json_encode([
            "success" => false,
            "message" => "Title, project ID, and status are required"
        ]);
        exit;
    }
    
    // Check if user is a member of the project
    $stmt = $pdo->prepare("
        SELECT COUNT(*) FROM project_members
        WHERE project_id = ? AND user_id = ?
    ");
    $stmt->execute([$data['project_id'], $userId]);
    if ($stmt->fetchColumn() === 0) {
        echo json_encode([
            "success" => false,
            "message" => "You don't have access to this project"
        ]);
        exit;
    }
    
    // Create task
    try {
        $stmt = $pdo->prepare("
            INSERT INTO tasks 
            (title, description, project_id, status, assignee, priority, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['title'],
            $data['description'] ?? '',
            $data['project_id'],
            $data['status'],
            $data['assignee'] ?? null,
            $data['priority'] ?? 0,
            $userId
        ]);
        
        $taskId = $pdo->lastInsertId();
        
        echo json_encode([
            "success" => true,
            "data" => [
                "id" => $taskId,
                "title" => $data['title'],
                "description" => $data['description'] ?? '',
                "project_id" => $data['project_id'],
                "status" => $data['status'],
                "assignee" => $data['assignee'] ?? null,
                "priority" => $data['priority'] ?? 0,
                "created_by" => $userId,
                "created_at" => date('Y-m-d H:i:s')
            ]
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Failed to create task: " . $e->getMessage()
        ]);
    }
}
```

### Database Schema

To set up your database, use the following SQL schema:

```sql
-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project members (maps users to projects)
CREATE TABLE project_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(project_id, user_id)
);

-- Tasks table
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'backlog',
    assignee INT,
    priority INT DEFAULT 0,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (assignee) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE NO ACTION
);

-- Task comments table
CREATE TABLE task_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE NO ACTION
);
```

## Running the Application

1. Set up a PHP server with the API files
2. Update the API_BASE_URL in the `useAuth.ts` file to point to your PHP server
3. Run the frontend application with `npm run dev`
