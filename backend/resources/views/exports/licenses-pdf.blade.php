<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Rapport Licences — LicenceManager</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; color: #1e293b; padding: 30px; }

        .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #3B82F6; padding-bottom: 20px; }
        .header h1 { font-size: 22px; color: #3B82F6; margin-bottom: 4px; }
        .header p { font-size: 11px; color: #64748b; }

        .kpis { display: table; width: 100%; margin-bottom: 25px; }
        .kpi { display: table-cell; text-align: center; padding: 12px 8px; background: #f1f5f9; border-radius: 8px; }
        .kpi-value { font-size: 20px; font-weight: 800; color: #0f172a; }
        .kpi-label { font-size: 8px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-top: 2px; }

        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #3B82F6; color: white; padding: 8px 6px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
        td { padding: 7px 6px; border-bottom: 1px solid #e2e8f0; font-size: 9px; }
        tr:nth-child(even) { background: #f8fafc; }

        .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 8px; font-weight: 700; }
        .badge-active { background: #dcfce7; color: #166534; }
        .badge-expired { background: #fee2e2; color: #991b1b; }
        .badge-revoked { background: #e2e8f0; color: #475569; }
        .badge-subscription { background: #e0f2fe; color: #0c4a6e; }
        .badge-perpetual { background: #dbeafe; color: #1e40af; }
        .badge-trial { background: #f3e8ff; color: #6b21a8; }

        .footer { margin-top: 30px; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        .text-right { text-align: right; }
        .font-bold { font-weight: 700; }

        .section-title { font-size: 13px; font-weight: 800; color: #0f172a; margin: 20px 0 8px; padding-bottom: 5px; border-bottom: 2px solid #e2e8f0; }
    </style>
</head>
<body>

    {{-- Header --}}
    <div class="header">
        <h1>🔑 LicenceManager</h1>
        <p>Rapport des licences logicielles — Dakar, Sénégal</p>
        <p>Généré le {{ now()->format('d/m/Y à H:i') }}</p>
    </div>

    {{-- KPIs --}}
    <div class="kpis">
        <div class="kpi" style="width:25%">
            <div class="kpi-value">{{ $stats['total'] }}</div>
            <div class="kpi-label">Total</div>
        </div>
        <div class="kpi" style="width:25%">
            <div class="kpi-value" style="color:#10B981">{{ $stats['active'] }}</div>
            <div class="kpi-label">Actives</div>
        </div>
        <div class="kpi" style="width:25%">
            <div class="kpi-value" style="color:#EF4444">{{ $stats['expired'] }}</div>
            <div class="kpi-label">Expirées</div>
        </div>
        <div class="kpi" style="width:25%">
            <div class="kpi-value" style="color:#F59E0B">{{ $stats['expiringSoon'] }}</div>
            <div class="kpi-label">Expirent sous 30j</div>
        </div>
    </div>

    {{-- Table --}}
    <div class="section-title">Liste complète des licences</div>
    <table>
        <thead>
            <tr>
                <th>Logiciel</th>
                <th>Éditeur</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Sièges</th>
                <th>Achat</th>
                <th>Expiration</th>
                <th class="text-right">Coût (FCFA)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($licenses as $license)
            <tr>
                <td class="font-bold">{{ $license->software->name }}</td>
                <td>{{ $license->software->vendor }}</td>
                <td>
                    <span class="badge badge-{{ $license->type->value }}">
                        {{ $license->type->label() }}
                    </span>
                </td>
                <td>
                    <span class="badge badge-{{ $license->status->value }}">
                        {{ $license->status->label() }}
                    </span>
                </td>
                <td>{{ $license->seats }}</td>
                <td>{{ $license->purchased_at->format('d/m/Y') }}</td>
                <td>{{ $license->expires_at?->format('d/m/Y') ?? '∞' }}</td>
                <td class="text-right font-bold">{{ number_format($license->cost, 0, ',', ' ') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    {{-- Total --}}
    <table style="margin-top: 5px;">
        <tr style="background: #f1f5f9;">
            <td colspan="7" class="font-bold" style="padding: 10px; font-size: 11px;">
                TOTAL INVESTISSEMENT
            </td>
            <td class="text-right font-bold" style="padding: 10px; font-size: 11px; color: #3B82F6;">
                {{ number_format($licenses->sum('cost'), 0, ',', ' ') }} F CFA
            </td>
        </tr>
    </table>

    {{-- Alertes --}}
    @if($alerts->count() > 0)
    <div class="section-title" style="color: #EF4444;">⚠ Alertes en cours ({{ $alerts->count() }})</div>
    <table>
        <thead>
            <tr style="background: #EF4444;">
                <th>Logiciel</th>
                <th>Type d'alerte</th>
                <th>Date</th>
            </tr>
        </thead>
        <tbody>
            @foreach($alerts as $alert)
            <tr>
                <td class="font-bold">{{ $alert->license->software->name }}</td>
                <td>{{ $alert->type->label() }}</td>
                <td>{{ $alert->triggered_at->format('d/m/Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <div class="footer">
        LicenceManager — Système de gestion des licences logicielles<br>
        Dakar, Sénégal 🇸🇳 — {{ now()->format('Y') }}
    </div>

</body>
</html>