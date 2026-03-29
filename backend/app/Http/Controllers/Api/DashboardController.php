<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\License;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $total        = License::count();
        $active       = License::where('status', 'active')->count();
        $expired      = License::where('status', 'expired')->count();
        $expiringSoon = License::where('status', 'active')
            ->whereBetween('expires_at', [now(), now()->addDays(30)])
            ->count();

        // Licences par catégorie (via software)
        $byCategory = DB::table('licenses')
            ->join('softwares', 'licenses.software_id', '=', 'softwares.id')
            ->select('softwares.category', DB::raw('COUNT(*) as count'))
            ->groupBy('softwares.category')
            ->get();

        // Coût mensuel sur 6 mois
        $monthlyCosts = License::selectRaw("DATE_FORMAT(purchased_at, '%Y-%m') as month")
            ->selectRaw('SUM(cost) as total')
            ->where('purchased_at', '>=', now()->subMonths(6)->startOfMonth())
            ->groupByRaw("DATE_FORMAT(purchased_at, '%Y-%m')")
            ->orderBy('month')
            ->get();

        // Remplir les mois manquants
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $m = now()->subMonths($i)->format('Y-m');
            $months->push([
                'month' => $m,
                'total' => (float) ($monthlyCosts->firstWhere('month', $m)?->total ?? 0),
            ]);
        }

        // Alertes urgentes non lues
        $urgentAlerts = Alert::with('license.software')
            ->where('is_read', false)
            ->latest('triggered_at')
            ->take(10)
            ->get();

        return response()->json([
            'kpis' => compact('total', 'active', 'expired', 'expiringSoon'),
            'byCategory'   => $byCategory,
            'monthlyCosts'  => $months,
            'urgentAlerts'  => $urgentAlerts,
        ]);
    }
}