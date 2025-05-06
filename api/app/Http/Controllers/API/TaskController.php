
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks.
     */
    public function index(): JsonResponse
    {
        $tasks = Task::with(['project', 'assignee'])->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $tasks
        ]);
    }

    /**
     * Store a newly created task.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|max:50',
            'priority' => 'required|string|max:50',
            'project_id' => 'required|exists:projects,id',
            'assignee_id' => 'nullable|exists:members,id',
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Task created successfully',
            'data' => $task
        ], 201);
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task): JsonResponse
    {
        $task->load(['project', 'assignee']);
        
        return response()->json([
            'status' => 'success',
            'data' => $task
        ]);
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, Task $task): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|max:50',
            'priority' => 'required|string|max:50',
            'project_id' => 'required|exists:projects,id',
            'assignee_id' => 'nullable|exists:members,id',
            'due_date' => 'nullable|date',
        ]);

        $task->update($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Task updated successfully',
            'data' => $task
        ]);
    }

    /**
     * Remove the specified task.
     */
    public function destroy(Task $task): JsonResponse
    {
        $task->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Task deleted successfully'
        ]);
    }
}
