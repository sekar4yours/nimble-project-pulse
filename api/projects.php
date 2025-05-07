
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
