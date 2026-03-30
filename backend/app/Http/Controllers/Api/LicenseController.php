<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLicenseRequest;
use App\Http\Requests\UpdateLicenseRequest;
use App\Models\License;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Alert;

class LicenseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = License::with('software')
            ->withCount(['assignments as active_seats' => fn ($q) => $q->whereNull('returned_at')]);

        // Filtre statut
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filtre catégorie (via software)
        if ($request->filled('category')) {
            $query->whereHas('software', fn ($q) =>
                $q->where('category', $request->category)
            );
        }

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('software', fn ($sq) =>
                    $sq->where('name', 'LIKE', "%{$search}%")
                       ->orWhere('vendor', 'LIKE', "%{$search}%")
                )->orWhere('notes', 'LIKE', "%{$search}%");
            });
        }

        $licenses = $query->latest()->paginate(15);

        return response()->json($licenses);
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

    public function export(): StreamedResponse
    {
        $licenses = License::with('software')->get();

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="licences_' . date('Y-m-d') . '.csv"',
        ];

        return response()->stream(function () use ($licenses) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, [
                'ID', 'Logiciel', 'Éditeur', 'Catégorie', 'Clé',
                'Type', 'Sièges', 'Statut', 'Achat', 'Expiration', 'Coût (FCFA)', 'Notes',
            ], ';');

            foreach ($licenses as $l) {
                fputcsv($out, [
                    $l->id,
                    $l->software->name,
                    $l->software->vendor,
                    $l->software->category->label(),
                    $l->license_key,
                    $l->type->label(),
                    $l->seats,
                    $l->status->label(),
                    $l->purchased_at->format('d/m/Y'),
                    $l->expires_at?->format('d/m/Y') ?? 'N/A',
                    number_format((float) $l->cost, 0, ',', ' '),
                    $l->notes,
                ], ';');
            }

            fclose($out);
        }, 200, $headers);
    }

    public function exportPdf()
    {
        $licenses = License::with('software')->orderBy('software_id')->get();

        $stats = [
            'total'        => License::count(),
            'active'       => License::where('status', 'active')->count(),
            'expired'      => License::where('status', 'expired')->count(),
            'expiringSoon' => License::where('status', 'active')
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