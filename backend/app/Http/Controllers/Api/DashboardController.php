<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use App\Models\Assignment;
use App\Models\License;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        try {
            $total   = License::count();
            $active  = License::where('status', 'active')->count();
            $expired = License::where('status', 'expired')->count();
            $revoked = License::where('status', 'revoked')->count();

            $expiringSoon = License::where('status', 'active')
                ->whereNotNull('expires_at')
                ->whereBetween('expires_at', [now(), now()->addDays(30)])
                ->count();

            $totalCost = (float) License::where('status', 'active')->sum('cost');

            $totalSeats = (int) License::where('status', 'active')->sum('seats');
            $usedSeats  = (int) Assignment::whereNull('returned_at')
                ->whereHas('license', fn ($q) => $q->where('status', 'active'))
                ->count();

            $unreadAlerts = Alert::where('is_read', false)->count();

            // --- Par catégorie ---
            $byCategory = DB::table('licenses')
                ->join('softwares', 'licenses.software_id', '=', 'softwares.id')
                ->select('softwares.category', DB::raw('COUNT(*) as count'))
                ->groupBy('softwares.category')
                ->get()
                ->map(fn ($row) => [
                    'category' => $row->category,
                    'count'    => (int) $row->count,
                ])
                ->values();

            // --- Par statut ---
            $byStatus = [
                ['name' => 'Actives',   'value' => $active,  'color' => '#10B981'],
                ['name' => 'Expirées',  'value' => $expired, 'color' => '#EF4444'],
                ['name' => 'Révoquées', 'value' => $revoked, 'color' => '#6B7280'],
            ];

            // --- Par type ---
            $typeLabels = [
                'perpetual'    => 'Perpétuelle',
                'subscription' => 'Abonnement',
                'trial'        => 'Essai',
            ];
            $typeColors = [
                'perpetual'    => '#3B82F6',
                'subscription' => '#06B6D4',
                'trial'        => '#A855F7',
            ];

            $byType = DB::table('licenses')
                ->select('type', DB::raw('COUNT(*) as count'))
                ->groupBy('type')
                ->get()
                ->map(fn ($row) => [
                    'name'  => $typeLabels[$row->type] ?? $row->type,
                    'value' => (int) $row->count,
                    'color' => $typeColors[$row->type] ?? '#6B7280',
                ])
                ->values();

            // --- Top 5 logiciels par coût ---
            $topSoftwares = DB::table('licenses')
                ->join('softwares', 'licenses.software_id', '=', 'softwares.id')
                ->where('licenses.status', 'active')
                ->select('softwares.name', DB::raw('SUM(licenses.cost) as total_cost'))
                ->groupBy('softwares.name')
                ->orderByDesc('total_cost')
                ->limit(5)
                ->get()
                ->map(fn ($row) => [
                    'name'       => $row->name,
                    'total_cost' => (float) $row->total_cost,
                ])
                ->values();

            // --- Coût mensuel 6 mois ---
            $monthlyCostsRaw = DB::table('licenses')
                ->selectRaw("DATE_FORMAT(purchased_at, '%Y-%m') as month, SUM(cost) as total")
                ->where('purchased_at', '>=', now()->subMonths(6)->startOfMonth())
                ->groupByRaw("DATE_FORMAT(purchased_at, '%Y-%m')")
                ->orderBy('month')
                ->get();

            $months = collect();
            for ($i = 5; $i >= 0; $i--) {
                $m = now()->subMonths($i)->format('Y-m');
                $found = $monthlyCostsRaw->firstWhere('month', $m);
                $months->push([
                    'month' => $m,
                    'total' => $found ? (float) $found->total : 0,
                ]);
            }

            // --- Alertes urgentes ---
            $urgentAlerts = Alert::with('license.software')
                ->where('is_read', false)
                ->latest('triggered_at')
                ->take(10)
                ->get();

            return response()->json([
                'kpis' => [
                    'total'        => $total,
                    'active'       => $active,
                    'expired'      => $expired,
                    'expiringSoon' => $expiringSoon,
                    'totalCost'    => $totalCost,
                    'totalSeats'   => $totalSeats,
                    'usedSeats'    => $usedSeats,
                    'unreadAlerts' => $unreadAlerts,
                ],
                'byCategory'   => $byCategory,
                'byStatus'     => $byStatus,
                'byType'       => $byType,
                'topSoftwares' => $topSoftwares,
                'monthlyCosts' => $months,
                'urgentAlerts' => $urgentAlerts,
            ]);

        } catch (\Exception $e) {
            Log::error('Dashboard stats error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'Erreur lors du chargement des statistiques.',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}