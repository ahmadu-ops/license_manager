<?php

use App\Http\Controllers\Api\AlertController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LicenseController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

// Export PDF — accessible via token en query string
Route::get('/licenses/export-pdf-download', function (\Illuminate\Http\Request $request) {
    if ($token = $request->query('token')) {
        $request->headers->set('Authorization', 'Bearer ' . $token);
    }
    $user = auth('sanctum')->user();
    if (! $user) {
        abort(401, 'Non autorisé');
    }
    return app(LicenseController::class)->exportPdf();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::get('/licenses/export-pdf', [LicenseController::class, 'exportPdf']);
    Route::apiResource('licenses', LicenseController::class);

    Route::post('/licenses/{license}/assignments', [AssignmentController::class, 'store']);
    Route::patch('/assignments/{assignment}/return', [AssignmentController::class, 'returnAssignment']);

    Route::get('/alerts', [AlertController::class, 'index']);
    Route::patch('/alerts/{alert}/read', [AlertController::class, 'markAsRead']);

    Route::get('/softwares', fn () => \App\Models\Software::orderBy('name')->get());
});