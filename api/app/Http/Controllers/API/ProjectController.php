
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    /**
     * Display a listing of the projects.
     */
    public function index(): JsonResponse
    {
        $projects = Project::with('members')->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $projects
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project = Project::create($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Project created successfully',
            'data' => $project
        ], 201);
    }

    /**
     * Display the specified project.
     */
    public function show(Project $project): JsonResponse
    {
        $project->load('members');
        
        return response()->json([
            'status' => 'success',
            'data' => $project
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $project->update($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Project updated successfully',
            'data' => $project
        ]);
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project): JsonResponse
    {
        $project->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Project deleted successfully'
        ]);
    }
    
    /**
     * Get members of a project.
     */
    public function members(Project $project): JsonResponse
    {
        $members = $project->members;
        
        return response()->json([
            'status' => 'success',
            'data' => $members
        ]);
    }
    
    /**
     * Add member to a project.
     */
    public function addMember(Request $request, Project $project): JsonResponse
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'role' => 'nullable|string|max:50',
        ]);
        
        $member = Member::find($request->member_id);
        $project->members()->attach($member, ['role' => $request->role ?? 'member']);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Member added to project successfully',
            'data' => $project->members
        ]);
    }
    
    /**
     * Remove member from a project.
     */
    public function removeMember(Project $project, Member $member): JsonResponse
    {
        $project->members()->detach($member);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Member removed from project successfully'
        ]);
    }
    
    /**
     * Get tasks of a project.
     */
    public function tasks(Project $project): JsonResponse
    {
        $tasks = $project->tasks()->with('assignee')->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $tasks
        ]);
    }
}
