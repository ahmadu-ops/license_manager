<?php

namespace App\Enums;

enum LicenseType: string
{
    case Perpetual    = 'perpetual';
    case Subscription = 'subscription';
    case Trial        = 'trial';

    public function label(): string
    {
        return match ($this) {
            self::Perpetual    => 'Perpétuelle',
            self::Subscription => 'Abonnement',
            self::Trial        => 'Essai',
        };
    }
}