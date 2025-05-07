
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
