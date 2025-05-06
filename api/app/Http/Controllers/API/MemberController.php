
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MemberController extends Controller
{
    /**
     * Display a listing of the members.
     */
    public function index(): JsonResponse
    {
        $members = Member::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $members
        ]);
    }

    /**
     * Store a newly created member.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email',
            'role' => 'nullable|string|max:50',
        ]);

        $member = Member::create($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Member created successfully',
            'data' => $member
        ], 201);
    }

    /**
     * Display the specified member.
     */
    public function show(Member $member): JsonResponse
    {
        $member->load('projects');
        
        return response()->json([
            'status' => 'success',
            'data' => $member
        ]);
    }

    /**
     * Update the specified member.
     */
    public function update(Request $request, Member $member): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email,'.$member->id,
            'role' => 'nullable|string|max:50',
        ]);

        $member->update($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Member updated successfully',
            'data' => $member
        ]);
    }

    /**
     * Remove the specified member.
     */
    public function destroy(Member $member): JsonResponse
    {
        $member->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Member deleted successfully'
        ]);
    }
}
