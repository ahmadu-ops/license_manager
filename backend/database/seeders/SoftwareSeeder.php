<?php

namespace Database\Seeders;

use App\Models\Software;
use Illuminate\Database\Seeder;

class SoftwareSeeder extends Seeder
{
    public function run(): void
    {
        $softwares = [
            ['name' => 'Microsoft 365',       'vendor' => 'Microsoft',   'category' => 'office',    'logo_url' => 'https://img.icons8.com/color/96/microsoft-365.png',       'website' => 'https://microsoft.com/microsoft-365'],
            ['name' => 'Adobe Creative Cloud', 'vendor' => 'Adobe',      'category' => 'design',    'logo_url' => 'https://img.icons8.com/color/96/adobe-creative-cloud.png', 'website' => 'https://adobe.com'],
            ['name' => 'Norton 360',           'vendor' => 'NortonLifeLock','category'=>'antivirus', 'logo_url' => 'https://img.icons8.com/color/96/norton-antivirus.png',    'website' => 'https://norton.com'],
            ['name' => 'Slack Business+',      'vendor' => 'Salesforce', 'category' => 'office',    'logo_url' => 'https://img.icons8.com/color/96/slack-new.png',            'website' => 'https://slack.com'],
            ['name' => 'JetBrains All Products','vendor'=> 'JetBrains',  'category' => 'dev',       'logo_url' => 'https://img.icons8.com/color/96/jetbrains.png',            'website' => 'https://jetbrains.com'],
            ['name' => 'Figma Organisation',   'vendor' => 'Figma',      'category' => 'design',    'logo_url' => 'https://img.icons8.com/color/96/figma.png',                'website' => 'https://figma.com'],
            ['name' => 'AutoCAD',              'vendor' => 'Autodesk',   'category' => 'design',    'logo_url' => 'https://img.icons8.com/color/96/autocad.png',              'website' => 'https://autodesk.com'],
            ['name' => 'Kaspersky Endpoint',   'vendor' => 'Kaspersky',  'category' => 'antivirus', 'logo_url' => 'https://img.icons8.com/color/96/kaspersky.png',            'website' => 'https://kaspersky.com'],
            ['name' => 'Visual Studio Enterprise','vendor'=>'Microsoft',  'category' => 'dev',       'logo_url' => 'https://img.icons8.com/color/96/visual-studio.png',       'website' => 'https://visualstudio.com'],
            ['name' => 'Zoom Business',        'vendor' => 'Zoom',       'category' => 'other',     'logo_url' => 'https://img.icons8.com/color/96/zoom.png',                 'website' => 'https://zoom.us'],
        ];

        foreach ($softwares as $s) {
            Software::create($s);
        }
    }
}