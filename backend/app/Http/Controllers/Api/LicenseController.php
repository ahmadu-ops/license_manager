<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLicenseRequest;
use App\Http\Requests\UpdateLicenseRequest;
use App\Models\Alert;
use App\Models\License;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LicenseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = License::with('software')
            ->withCount(['assignments as active_seats' => fn ($q) => $q->whereNull('returned_at')]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->whereHas('software', fn ($q) =>
                $q->where('category', $request->category)
            );
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('software', fn ($sq) =>
                    $sq->where('name', 'LIKE', "%{$search}%")
                       ->orWhere('vendor', 'LIKE', "%{$search}%")
                )->orWhere('notes', 'LIKE', "%{$search}%");
            });
        }

        return response()->json($query->latest()->paginate(15));
    }

    public function store(StoreLicenseRequest $request): JsonResponse
    {
        $license = License::create($request->validated());
        $license->load('software');

        return response()->json($license, 201);
    }

    public function show(License $license): JsonResponse
    {
        $license->load([
            'software',
            'assignments' => fn ($q) => $q->latest('assigned_at'),
            'alerts'      => fn ($q) => $q->latest('triggered_at')->take(10),
        ]);
        $license->loadCount(['assignments as active_seats' => fn ($q) => $q->whereNull('returned_at')]);

        return response()->json($license);
    }

    public function update(UpdateLicenseRequest $request, License $license): JsonResponse
    {
        $license->update($request->validated());
        $license->load('software');

        return response()->json($license);
    }

    public function destroy(License $license): JsonResponse
    {
        $license->delete();

        return response()->json(['message' => 'Licence supprimée.']);
    }

    public function exportPdf()
    {
        $licenses = License::with('software')->orderBy('software_id')->get();

        $stats = [
            'total'        => License::count(),
            'active'       => License::where('status', 'active')->count(),
            'expired'      => License::where('status', 'expired')->count(),
            'expiringSoon' => License::where('status', 'active')
                ->whereNotNull('expires_at')
                ->whereBetween('expires_at', [now(), now()->addDays(30)])
                ->count(),
        ];

        $alerts = Alert::with('license.software')
            ->where('is_read', false)
            ->latest('triggered_at')
            ->get();

        $pdf = Pdf::loadView('exports.licenses-pdf', compact('licenses', 'stats', 'alerts'));
        $pdf->setPaper('A4', 'landscape');

        return $pdf->download('licences_' . date('Y-m-d') . '.pdf');
    }
}