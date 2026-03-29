<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use Illuminate\Http\JsonResponse;

class AlertController extends Controller
{
    public function index(): JsonResponse
    {
        $alerts = Alert::with('license.software')
            ->where('is_read', false)
            ->latest('triggered_at')
            ->get();

        return response()->json($alerts);
    }

    public function markAsRead(Alert $alert): JsonResponse
    {
        $alert->update(['is_read' => true]);

        return response()->json($alert);
    }
}