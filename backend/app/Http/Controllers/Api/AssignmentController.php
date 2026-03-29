<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssignmentRequest;
use App\Models\Alert;
use App\Models\Assignment;
use App\Models\License;
use Illuminate\Http\JsonResponse;

class AssignmentController extends Controller
{
    public function store(StoreAssignmentRequest $request, License $license): JsonResponse
    {
        $activeCount = $license->activeAssignments()->count();

        $assignment = $license->assignments()->create([
            ...$request->validated(),
            'assigned_at' => now(),
        ]);

        // Alerte si dépassement
        if ($activeCount + 1 > $license->seats) {
            Alert::create([
                'license_id'   => $license->id,
                'type'         => 'overused',
                'triggered_at' => now(),
                'is_read'      => false,
            ]);
        }

        return response()->json($assignment, 201);
    }

    public function returnAssignment(Assignment $assignment): JsonResponse
    {
        $assignment->update(['returned_at' => now()]);

        return response()->json($assignment);
    }
}