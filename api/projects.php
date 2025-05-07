
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

// Add member to project
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['action']) && $_GET['action'] === 'add_member') {
    $userId = getAuthUserId();
    $data = getRequestData();
    
    if (!$userId) {
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized"
        ]);
        exit;
    }
    
    if (!isset($data['project_id']) || !isset($data['email'])) {
        echo json_encode([
            "success" => false,
            "message" => "Project ID and email are required"
        ]);
        exit;
    }
    
    try {
        $projectId = $data['project_id'];
        $email = $data['email'];
        $role = $data['role'] ?? 'member';
        
        // Check if the user is a member with owner role in the project
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM project_members 
            WHERE project_id = ? AND user_id = ? AND role = 'owner'
        ");
        $stmt->execute([$projectId, $userId]);
        
        if ($stmt->fetchColumn() === 0) {
            echo json_encode([
                "success" => false,
                "message" => "You don't have permission to add members to this project"
            ]);
            exit;
        }
        
        // Check if the user with the given email exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $newMemberId = $stmt->fetchColumn();
        
        if (!$newMemberId) {
            echo json_encode([
                "success" => false,
                "message" => "User with this email does not exist"
            ]);
            exit;
        }
        
        // Check if the user is already a member of the project
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM project_members 
            WHERE project_id = ? AND user_id = ?
        ");
        $stmt->execute([$projectId, $newMemberId]);
        
        if ($stmt->fetchColumn() > 0) {
            echo json_encode([
                "success" => false,
                "message" => "User is already a member of this project"
            ]);
            exit;
        }
        
        // Add the user to the project
        $stmt = $pdo->prepare("
            INSERT INTO project_members (project_id, user_id, role) 
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$projectId, $newMemberId, $role]);
        
        // Get the user details to return
        $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE id = ?");
        $stmt->execute([$newMemberId]);
        $newMember = $stmt->fetch(PDO::FETCH_ASSOC);
        $newMember['role'] = $role;
        
        echo json_encode([
            "success" => true,
            "data" => $newMember
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Failed to add member: " . $e->getMessage()
        ]);
    }
}
