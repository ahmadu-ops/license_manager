<?php

namespace Database\Seeders;

use App\Models\Alert;
use App\Models\Assignment;
use App\Models\License;
use Illuminate\Database\Seeder;

class LicenseSeeder extends Seeder
{
    public function run(): void
    {
        $licenses = [
            // Microsoft 365 (id 1)
            ['software_id'=>1,'license_key'=>'MS365-XXXX-1111-AAAA-ZZZZ','type'=>'subscription','seats'=>50, 'status'=>'active', 'purchased_at'=>'2024-06-01','expires_at'=>'2025-06-01','cost'=>6500.00,'notes'=>'Licence entreprise'],
            ['software_id'=>1,'license_key'=>'MS365-YYYY-2222-BBBB-WWWW','type'=>'subscription','seats'=>10, 'status'=>'active', 'purchased_at'=>'2025-01-15','expires_at'=>'2026-01-15','cost'=>1300.00,'notes'=>'Département marketing'],
            // Adobe (id 2)
            ['software_id'=>2,'license_key'=>'ADBE-CC-3333-CCCC-VVVV','type'=>'subscription','seats'=>15,'status'=>'active','purchased_at'=>'2024-09-01','expires_at'=>'2025-09-01','cost'=>8400.00,'notes'=>'Équipe créative'],
            ['software_id'=>2,'license_key'=>'ADBE-CC-4444-DDDD-UUUU','type'=>'trial','seats'=>2,'status'=>'expired','purchased_at'=>'2024-11-01','expires_at'=>'2024-12-01','cost'=>0.00,'notes'=>'Essai stagiaires'],
            // Norton (id 3)
            ['software_id'=>3,'license_key'=>'NRT-360-5555-EEEE-TTTT','type'=>'subscription','seats'=>100,'status'=>'active','purchased_at'=>'2024-03-15','expires_at'=>'2025-03-15','cost'=>4200.00,'notes'=>'Protection parc complet'],
            // Slack (id 4)
            ['software_id'=>4,'license_key'=>'SLK-BIZ-6666-FFFF-SSSS','type'=>'subscription','seats'=>75,'status'=>'active','purchased_at'=>'2025-02-01','expires_at'=>'2026-02-01','cost'=>9000.00,'notes'=>'Toute l\'entreprise'],
            // JetBrains (id 5)
            ['software_id'=>5,'license_key'=>'JB-ALL-7777-GGGG-RRRR','type'=>'subscription','seats'=>20,'status'=>'active','purchased_at'=>'2024-07-01','expires_at'=>'2025-07-01','cost'=>5800.00,'notes'=>'Équipe développement'],
            ['software_id'=>5,'license_key'=>'JB-ALL-8888-HHHH-QQQQ','type'=>'perpetual','seats'=>5,'status'=>'active','purchased_at'=>'2023-01-10','expires_at'=>null,'cost'=>3500.00,'notes'=>'Licences perpétuelles legacy'],
            // Figma (id 6)
            ['software_id'=>6,'license_key'=>'FGM-ORG-9999-IIII-PPPP','type'=>'subscription','seats'=>12,'status'=>'active','purchased_at'=>'2025-03-01','expires_at'=>'2026-03-01','cost'=>5400.00,'notes'=>'UX/UI designers'],
            // AutoCAD (id 7)
            ['software_id'=>7,'license_key'=>'ACAD-0000-JJJJ-OOOO-NNNN','type'=>'subscription','seats'=>8,'status'=>'expired','purchased_at'=>'2023-06-01','expires_at'=>'2024-06-01','cost'=>12000.00,'notes'=>'Bureau d\'études'],
            ['software_id'=>7,'license_key'=>'ACAD-1111-KKKK-MMMM-LLLL','type'=>'perpetual','seats'=>3,'status'=>'active','purchased_at'=>'2022-01-15','expires_at'=>null,'cost'=>9500.00,'notes'=>'Version 2022 perpétuelle'],
            // Kaspersky (id 8)
            ['software_id'=>8,'license_key'=>'KSP-END-2222-LLLL-KKKK','type'=>'subscription','seats'=>200,'status'=>'active','purchased_at'=>'2024-12-01','expires_at'=>'2025-12-01','cost'=>7600.00,'notes'=>'Protection endpoints'],
            // Visual Studio (id 9)
            ['software_id'=>9,'license_key'=>'VS-ENT-3333-MMMM-JJJJ','type'=>'subscription','seats'=>15,'status'=>'active','purchased_at'=>'2024-10-01','expires_at'=>'2025-10-01','cost'=>6300.00,'notes'=>'Développeurs .NET'],
            ['software_id'=>9,'license_key'=>'VS-ENT-4444-NNNN-IIII','type'=>'trial','seats'=>3,'status'=>'active','purchased_at'=>'2025-05-01','expires_at'=>'2025-06-15','cost'=>0.00,'notes'=>'Évaluation nouveaux devs'],
            // Zoom (id 10)
            ['software_id'=>10,'license_key'=>'ZM-BIZ-5555-OOOO-HHHH','type'=>'subscription','seats'=>30,'status'=>'active','purchased_at'=>'2025-01-01','expires_at'=>'2026-01-01','cost'=>4800.00,'notes'=>'Salles de réunion'],
            ['software_id'=>10,'license_key'=>'ZM-BIZ-6666-PPPP-GGGG','type'=>'subscription','seats'=>10,'status'=>'revoked','purchased_at'=>'2024-01-01','expires_at'=>'2025-01-01','cost'=>1600.00,'notes'=>'Ancien contrat résilié'],
            // Extras
            ['software_id'=>1,'license_key'=>'MS365-ZZZZ-7777-QQQQ-FFFF','type'=>'subscription','seats'=>5,'status'=>'active','purchased_at'=>'2025-04-01','expires_at'=>'2025-07-01','cost'=>650.00,'notes'=>'Contrat court direction'],
            ['software_id'=>3,'license_key'=>'NRT-360-8888-RRRR-EEEE','type'=>'subscription','seats'=>25,'status'=>'active','purchased_at'=>'2025-05-10','expires_at'=>'2025-06-20','cost'=>1050.00,'notes'=>'Filiale Lyon — expire bientôt'],
            ['software_id'=>5,'license_key'=>'JB-ALL-9999-SSSS-DDDD','type'=>'trial','seats'=>2,'status'=>'expired','purchased_at'=>'2025-02-01','expires_at'=>'2025-03-01','cost'=>0.00,'notes'=>'Test Rider'],
            ['software_id'=>6,'license_key'=>'FGM-ORG-0000-TTTT-CCCC','type'=>'subscription','seats'=>5,'status'=>'active','purchased_at'=>'2025-04-15','expires_at'=>'2025-06-18','cost'=>2250.00,'notes'=>'Freelances externes — expire bientôt'],
        ];

        foreach ($licenses as $l) {
            License::create($l);
        }

        // Assignments réalistes
        $people = [
            ['assigned_to'=>'Jean Dupont',    'device_name'=>'PC-COMPTA-01'],
            ['assigned_to'=>'Marie Martin',   'device_name'=>'MAC-DESIGN-03'],
            ['assigned_to'=>'Pierre Bernard', 'device_name'=>'PC-DEV-07'],
            ['assigned_to'=>'Sophie Leroy',   'device_name'=>'PC-RH-02'],
            ['assigned_to'=>'Lucas Moreau',   'device_name'=>'MAC-DESIGN-05'],
            ['assigned_to'=>'Emma Petit',     'device_name'=>'PC-MARKET-04'],
            ['assigned_to'=>'Hugo Roux',      'device_name'=>'PC-DEV-09'],
            ['assigned_to'=>'Léa Fournier',   'device_name'=>'LAPTOP-DIR-01'],
            ['assigned_to'=>'Thomas Girard',  'device_name'=>'PC-DEV-11'],
            ['assigned_to'=>'Camille Bonnet', 'device_name'=>'MAC-UX-02'],
        ];

        // Licence 1 (MS365 50 sièges) → 4 attributions
        foreach (array_slice($people, 0, 4) as $p) {
            Assignment::create([...$p, 'license_id' => 1, 'assigned_at' => now()->subDays(rand(10,90))]);
        }
        // Licence 3 (Adobe 15 sièges) → 3 attributions
        foreach (array_slice($people, 1, 3) as $p) {
            Assignment::create([...$p, 'license_id' => 3, 'assigned_at' => now()->subDays(rand(5,60))]);
        }
        // Licence 7 (JetBrains 20 sièges) → 3 attributions
        foreach (array_slice($people, 4, 3) as $p) {
            Assignment::create([...$p, 'license_id' => 7, 'assigned_at' => now()->subDays(rand(15,120))]);
        }
        // Licence 9 (Figma 12 sièges) → 2 attributions
        foreach (array_slice($people, 8, 2) as $p) {
            Assignment::create([...$p, 'license_id' => 9, 'assigned_at' => now()->subDays(rand(3,30))]);
        }

        // Alertes initiales
        Alert::create(['license_id'=>18,'type'=>'expiry_soon','triggered_at'=>now(),'is_read'=>false]);
        Alert::create(['license_id'=>20,'type'=>'expiry_soon','triggered_at'=>now(),'is_read'=>false]);
        Alert::create(['license_id'=>10,'type'=>'expired','triggered_at'=>now()->subDays(30),'is_read'=>false]);
        Alert::create(['license_id'=>4, 'type'=>'expired','triggered_at'=>now()->subDays(60),'is_read'=>false]);
    }
}