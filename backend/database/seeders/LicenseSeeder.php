<?php

namespace Database\Seeders;

use App\Models\Alert;
use App\Models\Assignment;
use App\Models\License;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class LicenseSeeder extends Seeder
{
    public function run(): void
    {
        // Dates dynamiques pour que les graphes aient toujours des données
        $now = Carbon::now();

        $licenses = [
            // Microsoft 365 (id 1)
            ['software_id'=>1,'license_key'=>'MS365-XXXX-1111-AAAA-ZZZZ','type'=>'subscription','seats'=>50,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(5)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addMonths(7)->format('Y-m-d'),
             'cost'=>4260000,'notes'=>'Licence entreprise — siège Dakar'],

            ['software_id'=>1,'license_key'=>'MS365-YYYY-2222-BBBB-WWWW','type'=>'subscription','seats'=>10,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(2)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addMonths(10)->format('Y-m-d'),
             'cost'=>852000,'notes'=>'Département marketing Plateau'],

            // Adobe (id 2)
            ['software_id'=>2,'license_key'=>'ADBE-CC-3333-CCCC-VVVV','type'=>'subscription','seats'=>15,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(4)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addMonths(8)->format('Y-m-d'),
             'cost'=>5510000,'notes'=>'Équipe créative Almadies'],

            ['software_id'=>2,'license_key'=>'ADBE-CC-4444-DDDD-UUUU','type'=>'trial','seats'=>2,'status'=>'expired',
             'purchased_at'=>$now->copy()->subMonths(3)->format('Y-m-d'),
             'expires_at'=>$now->copy()->subMonths(2)->format('Y-m-d'),
             'cost'=>0,'notes'=>'Essai stagiaires UGB Saint-Louis'],

            // Norton (id 3)
            ['software_id'=>3,'license_key'=>'NRT-360-5555-EEEE-TTTT','type'=>'subscription','seats'=>100,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(6)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addMonths(6)->format('Y-m-d'),
             'cost'=>2755000,'notes'=>'Protection parc complet siège'],

            // Slack (id 4)
            ['software_id'=>4,'license_key'=>'SLK-BIZ-6666-FFFF-SSSS','type'=>'subscription','seats'=>75,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(1)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addMonths(11)->format('Y-m-d'),
             'cost'=>5904000,'notes'=>'Toute l\'entreprise — Dakar + Thiès'],

            // JetBrains (id 5)
            ['software_id'=>5,'license_key'=>'JB-ALL-7777-GGGG-RRRR','type'=>'subscription','seats'=>20,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(3)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addMonths(9)->format('Y-m-d'),
             'cost'=>3805000,'notes'=>'Équipe développement Mermoz'],

            ['software_id'=>5,'license_key'=>'JB-ALL-8888-HHHH-QQQQ','type'=>'perpetual','seats'=>5,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(5)->format('Y-m-d'),
             'expires_at'=>null,
             'cost'=>2296000,'notes'=>'Licences perpétuelles legacy'],

            // Figma (id 6)
            ['software_id'=>6,'license_key'=>'FGM-ORG-9999-IIII-PPPP','type'=>'subscription','seats'=>12,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(1)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addMonths(11)->format('Y-m-d'),
             'cost'=>3542000,'notes'=>'UX/UI designers — Point E'],

            // AutoCAD (id 7)
            ['software_id'=>7,'license_key'=>'ACAD-0000-JJJJ-OOOO-NNNN','type'=>'subscription','seats'=>8,'status'=>'expired',
             'purchased_at'=>$now->copy()->subMonths(6)->format('Y-m-d'),
             'expires_at'=>$now->copy()->subMonths(1)->format('Y-m-d'),
             'cost'=>7872000,'notes'=>'Bureau d\'études Sacré-Cœur'],

            ['software_id'=>7,'license_key'=>'ACAD-1111-KKKK-MMMM-LLLL','type'=>'perpetual','seats'=>3,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(4)->format('Y-m-d'),
             'expires_at'=>null,
             'cost'=>6232000,'notes'=>'Version 2022 perpétuelle'],

            // Kaspersky (id 8)
            ['software_id'=>8,'license_key'=>'KSP-END-2222-LLLL-KKKK','type'=>'subscription','seats'=>200,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(2)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addMonths(10)->format('Y-m-d'),
             'cost'=>4986000,'notes'=>'Protection endpoints tout le réseau'],

            // Visual Studio (id 9)
            ['software_id'=>9,'license_key'=>'VS-ENT-3333-MMMM-JJJJ','type'=>'subscription','seats'=>15,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(3)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addMonths(9)->format('Y-m-d'),
             'cost'=>4133000,'notes'=>'Développeurs .NET — Ngor'],

            ['software_id'=>9,'license_key'=>'VS-ENT-4444-NNNN-IIII','type'=>'trial','seats'=>3,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(0)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addDays(20)->format('Y-m-d'),
             'cost'=>0,'notes'=>'Évaluation nouveaux devs ESP Dakar'],

            // Zoom (id 10)
            ['software_id'=>10,'license_key'=>'ZM-BIZ-5555-OOOO-HHHH','type'=>'subscription','seats'=>30,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(2)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addMonths(10)->format('Y-m-d'),
             'cost'=>3149000,'notes'=>'Salles de réunion Plateau + Almadies'],

            ['software_id'=>10,'license_key'=>'ZM-BIZ-6666-PPPP-GGGG','type'=>'subscription','seats'=>10,'status'=>'revoked',
             'purchased_at'=>$now->copy()->subMonths(5)->format('Y-m-d'),
             'expires_at'=>$now->copy()->subMonths(1)->format('Y-m-d'),
             'cost'=>1050000,'notes'=>'Ancien contrat résilié filiale Ziguinchor'],

            // Extras — mois variés
            ['software_id'=>1,'license_key'=>'MS365-ZZZZ-7777-QQQQ-FFFF','type'=>'subscription','seats'=>5,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(1)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addDays(25)->format('Y-m-d'),
             'cost'=>426000,'notes'=>'Contrat court direction générale'],

            ['software_id'=>3,'license_key'=>'NRT-360-8888-RRRR-EEEE','type'=>'subscription','seats'=>25,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(0)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addDays(15)->format('Y-m-d'),
             'cost'=>689000,'notes'=>'Filiale Thiès — expire bientôt'],

            ['software_id'=>5,'license_key'=>'JB-ALL-9999-SSSS-DDDD','type'=>'trial','seats'=>2,'status'=>'expired',
             'purchased_at'=>$now->copy()->subMonths(2)->format('Y-m-d'),
             'expires_at'=>$now->copy()->subMonths(1)->format('Y-m-d'),
             'cost'=>0,'notes'=>'Test Rider — Université Cheikh Anta Diop'],

            ['software_id'=>6,'license_key'=>'FGM-ORG-0000-TTTT-CCCC','type'=>'subscription','seats'=>5,'status'=>'active',
             'purchased_at'=>$now->copy()->subMonths(0)->format('Y-m-d'),
             'expires_at'=>$now->copy()->addDays(12)->format('Y-m-d'),
             'cost'=>1476000,'notes'=>'Freelances Dakar — expire bientôt'],
        ];

        foreach ($licenses as $l) {
            License::create($l);
        }

        // Attributions sénégalaises
        $people = [
            ['assigned_to' => 'Moussa Ndiaye',    'device_name' => 'PC-COMPTA-01'],
            ['assigned_to' => 'Fatou Sow',         'device_name' => 'MAC-DESIGN-03'],
            ['assigned_to' => 'Ibrahima Fall',     'device_name' => 'PC-DEV-07'],
            ['assigned_to' => 'Aminata Diop',      'device_name' => 'PC-RH-02'],
            ['assigned_to' => 'Ousmane Ba',        'device_name' => 'MAC-DESIGN-05'],
            ['assigned_to' => 'Mariama Sarr',      'device_name' => 'PC-MARKET-04'],
            ['assigned_to' => 'Cheikh Mbaye',      'device_name' => 'PC-DEV-09'],
            ['assigned_to' => 'Aïssatou Diallo',   'device_name' => 'LAPTOP-DIR-01'],
            ['assigned_to' => 'Modou Gueye',       'device_name' => 'PC-DEV-11'],
            ['assigned_to' => 'Ndèye Thiam',       'device_name' => 'MAC-UX-02'],
        ];

        foreach (array_slice($people, 0, 4) as $p) {
            Assignment::create([...$p, 'license_id' => 1, 'assigned_at' => now()->subDays(rand(10, 90))]);
        }
        foreach (array_slice($people, 1, 3) as $p) {
            Assignment::create([...$p, 'license_id' => 3, 'assigned_at' => now()->subDays(rand(5, 60))]);
        }
        foreach (array_slice($people, 4, 3) as $p) {
            Assignment::create([...$p, 'license_id' => 7, 'assigned_at' => now()->subDays(rand(15, 120))]);
        }
        foreach (array_slice($people, 8, 2) as $p) {
            Assignment::create([...$p, 'license_id' => 9, 'assigned_at' => now()->subDays(rand(3, 30))]);
        }

        // Alertes
        Alert::create(['license_id' => 18, 'type' => 'expiry_soon', 'triggered_at' => now(), 'is_read' => false]);
        Alert::create(['license_id' => 20, 'type' => 'expiry_soon', 'triggered_at' => now(), 'is_read' => false]);
        Alert::create(['license_id' => 10, 'type' => 'expired', 'triggered_at' => now()->subDays(30), 'is_read' => false]);
        Alert::create(['license_id' => 4,  'type' => 'expired', 'triggered_at' => now()->subDays(60), 'is_read' => false]);
    }
}