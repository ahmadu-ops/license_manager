<?php

namespace App\Enums;

enum SoftwareCategory: string
{
    case Antivirus = 'antivirus';
    case Office    = 'office';
    case Design    = 'design';
    case Dev       = 'dev';
    case Other     = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Antivirus => 'Antivirus',
            self::Office    => 'Bureautique',
            self::Design    => 'Design',
            self::Dev       => 'Développement',
            self::Other     => 'Autre',
        };
    }
}