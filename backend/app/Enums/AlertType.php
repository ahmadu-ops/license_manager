<?php

namespace App\Enums;

enum AlertType: string
{
    case ExpirySoon = 'expiry_soon';
    case Expired    = 'expired';
    case Overused   = 'overused';

    public function label(): string
    {
        return match ($this) {
            self::ExpirySoon => 'Expiration proche',
            self::Expired    => 'Expirée',
            self::Overused   => 'Surutilisée',
        };
    }
}