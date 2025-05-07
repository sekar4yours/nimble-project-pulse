
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
    
    // Check if it's a request for a specific task
    if (isset($_GET['task_id'])) {
        $taskId = $_GET['task_id'];
        
        // Get task details
        $stmt = $pdo->prepare("
            SELECT t.*, u.name as creator_name, a.name as assignee_name 
            FROM tasks t
            LEFT JOIN users u ON t.created_by = u.id
            LEFT JOIN users a ON t.assignee = a.id
            WHERE t.id = ?
        ");
        $stmt->execute([$taskId]);
        $task = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$task) {
            echo json_encode([
                "success" => false,
                "message" => "Task not found"
            ]);
            exit;
        }
        
        // Check if user has access to the task's project
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM project_members
            WHERE project_id = ? AND user_id = ?
        ");
        $stmt->execute([$task['project_id'], $userId]);
        if ($stmt->fetchColumn() === 0) {
            echo json_encode([
                "success" => false,
                "message" => "You don't have access to this task"
            ]);
            exit;
        }
        
        // Get comments for the task
        $stmt = $pdo->prepare("
            SELECT c.*, u.name as author_name
            FROM task_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.task_id = ?
            ORDER BY c.created_at ASC
        ");
        $stmt->execute([$taskId]);
        $task['comments'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            "success" => true,
            "data" => $task
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
        SELECT t.*, u.name as creator_name, a.name as assignee_name 
        FROM tasks t
        LEFT JOIN users u ON t.created_by = u.id
        LEFT JOIN users a ON t.assignee = a.id
        WHERE t.project_id = ?
        ORDER BY t.status, t.priority DESC
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

// Add comment to task
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'add_comment') {
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
    if (!isset($data['task_id']) || !isset($data['content'])) {
        echo json_encode([
            "success" => false,
            "message" => "Task ID and content are required"
        ]);
        exit;
    }
    
    try {
        // Get task details to check project access
        $stmt = $pdo->prepare("SELECT project_id FROM tasks WHERE id = ?");
        $stmt->execute([$data['task_id']]);
        $task = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$task) {
            echo json_encode([
                "success" => false,
                "message" => "Task not found"
            ]);
            exit;
        }
        
        // Check if user has access to the task's project
        $stmt = $pdo->prepare("
            SELECT COUNT(*) FROM project_members
            WHERE project_id = ? AND user_id = ?
        ");
        $stmt->execute([$task['project_id'], $userId]);
        if ($stmt->fetchColumn() === 0) {
            echo json_encode([
                "success" => false,
                "message" => "You don't have access to this task"
            ]);
            exit;
        }
        
        // Add comment
        $stmt = $pdo->prepare("
            INSERT INTO task_comments (task_id, user_id, content)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$data['task_id'], $userId, $data['content']]);
        $commentId = $pdo->lastInsertId();
        
        // Get user name for response
        $stmt = $pdo->prepare("SELECT name FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $userName = $stmt->fetchColumn();
        
        echo json_encode([
            "success" => true,
            "data" => [
                "id" => $commentId,
                "task_id" => $data['task_id'],
                "user_id" => $userId,
                "author_name" => $userName,
                "content" => $data['content'],
                "created_at" => date('Y-m-d H:i:s')
            ]
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Failed to add comment: " . $e->getMessage()
        ]);
    }
}
