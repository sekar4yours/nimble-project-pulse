
<?php
require_once 'config.php';

// Get user data, projects, and tasks
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userId = getAuthUserId();
    
    if (!$userId) {
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized"
        ]);
        exit;
    }
    
    try {
        // Get user data
        $stmt = $pdo->prepare("SELECT id, name, email FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Get user's projects
        $stmt = $pdo->prepare("
            SELECT p.* FROM projects p
            JOIN project_members pm ON p.id = pm.project_id
            WHERE pm.user_id = ?
        ");
        $stmt->execute([$userId]);
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get project members for each project
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
        
        // Get tasks for the first project (if any)
        $tasks = [];
        if (!empty($projects)) {
            $firstProjectId = $projects[0]['id'];
            
            $stmt = $pdo->prepare("
                SELECT t.*, u.name as creator_name, a.name as assignee_name 
                FROM tasks t
                LEFT JOIN users u ON t.created_by = u.id
                LEFT JOIN users a ON t.assignee = a.id
                WHERE t.project_id = ?
                ORDER BY t.status, t.priority DESC
            ");
            $stmt->execute([$firstProjectId]);
            $allTasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Group tasks by status
            $tasks = [
                'backlog' => [],
                'in-progress' => [],
                'done' => []
            ];
            
            foreach ($allTasks as $task) {
                $status = $task['status'];
                if (!isset($tasks[$status])) {
                    $status = 'backlog';
                }
                $tasks[$status][] = $task;
            }
        }
        
        // Return all data
        echo json_encode([
            "success" => true,
            "data" => [
                "user" => $userData,
                "projects" => $projects,
                "tasks" => $tasks
            ]
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Failed to fetch data: " . $e->getMessage()
        ]);
    }
}
