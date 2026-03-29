<?php

namespace App\Console\Commands;

use App\Models\Alert;
use App\Models\License;
use Illuminate\Console\Command;

class CheckLicenseExpiry extends Command
{
    protected $signature   = 'licenses:check-expiry';
    protected $description = 'Vérifie les licences expirées ou bientôt expirées et génère les alertes';

    public function handle(): int
    {
        $created = 0;

        // 1️⃣ Expirées : status active + expires_at passé
        $expired = License::where('status', 'active')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', now())
            ->get();

        foreach ($expired as $license) {
            $license->update(['status' => 'expired']);
            Alert::create([
                'license_id'   => $license->id,
                'type'         => 'expired',
                'triggered_at' => now(),
                'is_read'      => false,
            ]);
            $created++;
        }
        $this->info("⛔ {$expired->count()} licence(s) marquée(s) expirée(s).");

        // 2️⃣ Expiration ≤ 30 jours (sans doublon récent)
        $expiringSoon = License::where('status', 'active')
            ->whereNotNull('expires_at')
            ->whereBetween('expires_at', [now(), now()->addDays(30)])
            ->get();

        foreach ($expiringSoon as $license) {
            $alreadyAlerted = Alert::where('license_id', $license->id)
                ->where('type', 'expiry_soon')
                ->where('triggered_at', '>=', now()->subDays(7))
                ->exists();

            if (! $alreadyAlerted) {
                Alert::create([
                    'license_id'   => $license->id,
                    'type'         => 'expiry_soon',
                    'triggered_at' => now(),
                    'is_read'      => false,
                ]);
                $created++;
            }
        }
        $this->info("⚠️  {$expiringSoon->count()} licence(s) expirant dans 30 jours.");

        // 3️⃣ Surutilisation
        $overused = License::where('status', 'active')
            ->withCount(['assignments as active_count' => fn ($q) => $q->whereNull('returned_at')])
            ->get()
            ->filter(fn ($l) => $l->active_count > $l->seats);

        foreach ($overused as $license) {
            $alreadyAlerted = Alert::where('license_id', $license->id)
                ->where('type', 'overused')
                ->where('triggered_at', '>=', now()->subDays(1))
                ->exists();

            if (! $alreadyAlerted) {
                Alert::create([
                    'license_id'   => $license->id,
                    'type'         => 'overused',
                    'triggered_at' => now(),
                    'is_read'      => false,
                ]);
                $created++;
            }
        }
        $this->info("🔴 {$overused->count()} licence(s) surutilisée(s).");
        $this->info("✅ {$created} alerte(s) créée(s) au total.");

        return Command::SUCCESS;
    }
}