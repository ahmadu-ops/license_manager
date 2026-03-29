<?php

namespace App\Models;

use App\Enums\LicenseStatus;
use App\Enums\LicenseType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class License extends Model
{
    protected $fillable = [
        'software_id',
        'license_key',
        'type',
        'seats',
        'status',
        'purchased_at',
        'expires_at',
        'cost',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'license_key' => 'encrypted',
            'type'        => LicenseType::class,
            'status'      => LicenseStatus::class,
            'seats'       => 'integer',
            'cost'        => 'decimal:2',
            'purchased_at'=> 'date',
            'expires_at'  => 'date',
        ];
    }

    /* ---------- relations ---------- */

    public function software(): BelongsTo
    {
        return $this->belongsTo(Software::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class);
    }

    public function activeAssignments(): HasMany
    {
        return $this->hasMany(Assignment::class)->whereNull('returned_at');
    }

    public function alerts(): HasMany
    {
        return $this->hasMany(Alert::class);
    }

    /* ---------- accessors ---------- */

    public function getCostPerSeatAttribute(): float
    {
        return $this->seats > 0
            ? round((float) $this->cost / $this->seats, 2)
            : 0;
    }

    public function getActiveSeatsAttribute(): int
    {
        return $this->activeAssignments()->count();
    }
}