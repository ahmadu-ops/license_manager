<?php

use App\Http\Controllers\Api\AlertController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\LicenseController;
use App\Http\Controllers\Api\SoftwareController;
use Illuminate\Support\Facades\Route;

Route::options('/{any}', fn () => response('', 204))->where('any', '.*');

Route::post('/login', [AuthController::class, 'login']);

Route::get('/licenses/export-pdf-download', function (\Illuminate\Http\Request $request) {
    if ($token = $request->query('token')) {
        $request->headers->set('Authorization', 'Bearer ' . $token);
    }
    if (! auth('sanctum')->user()) {
        abort(401);
    }
    return app(LicenseController::class)->exportPdf();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::apiResource('licenses', LicenseController::class);
    Route::post('/licenses/{license}/assignments', [AssignmentController::class, 'store']);
    Route::patch('/assignments/{assignment}/return', [AssignmentController::class, 'returnAssignment']);

    Route::apiResource('softwares', SoftwareController::class);

    Route::get('/alerts', [AlertController::class, 'index']);
    Route::patch('/alerts/{alert}/read', [AlertController::class, 'markAsRead']);
});