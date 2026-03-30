<?php

namespace Database\Seeders;

use App\Models\Software;
use Illuminate\Database\Seeder;

class SoftwareSeeder extends Seeder
{
    public function run(): void
    {
        $softwares = [
            ['name' => 'Microsoft 365',        'vendor' => 'Microsoft',      'category' => 'office',    'website' => 'https://microsoft.com/microsoft-365'],
            ['name' => 'Adobe Creative Cloud',  'vendor' => 'Adobe',         'category' => 'design',    'website' => 'https://adobe.com'],
            ['name' => 'Norton 360',            'vendor' => 'NortonLifeLock', 'category' => 'antivirus', 'website' => 'https://norton.com'],
            ['name' => 'Slack Business+',       'vendor' => 'Salesforce',    'category' => 'office',    'website' => 'https://slack.com'],
            ['name' => 'JetBrains All Products','vendor' => 'JetBrains',     'category' => 'dev',       'website' => 'https://jetbrains.com'],
            ['name' => 'Figma Organisation',    'vendor' => 'Figma',         'category' => 'design',    'website' => 'https://figma.com'],
            ['name' => 'AutoCAD',               'vendor' => 'Autodesk',      'category' => 'design',    'website' => 'https://autodesk.com'],
            ['name' => 'Kaspersky Endpoint',    'vendor' => 'Kaspersky',     'category' => 'antivirus', 'website' => 'https://kaspersky.com'],
            ['name' => 'Visual Studio Enterprise','vendor' => 'Microsoft',   'category' => 'dev',       'website' => 'https://visualstudio.com'],
            ['name' => 'Zoom Business',         'vendor' => 'Zoom',          'category' => 'other',     'website' => 'https://zoom.us'],
        ];

        foreach ($softwares as $s) {
            Software::create([...$s, 'logo_url' => null]);
        }
    }
}