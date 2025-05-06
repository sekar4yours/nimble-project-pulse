
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\MemberController;
use App\Http\Controllers\API\TaskController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('v1')->group(function () {
    // Projects
    Route::apiResource('projects', ProjectController::class);
    
    // Members
    Route::apiResource('members', MemberController::class);
    
    // Tasks
    Route::apiResource('tasks', TaskController::class);
    
    // Project Members
    Route::get('projects/{project}/members', [ProjectController::class, 'members']);
    Route::post('projects/{project}/members', [ProjectController::class, 'addMember']);
    Route::delete('projects/{project}/members/{member}', [ProjectController::class, 'removeMember']);
    
    // Project Tasks
    Route::get('projects/{project}/tasks', [ProjectController::class, 'tasks']);
});

// Protected routes (add auth middleware as needed)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
