<?php

namespace App\Models;

use App\Enums\AlertType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alert extends Model
{
    protected $fillable = [
        'license_id',
        'type',
        'triggered_at',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'type'         => AlertType::class,
            'triggered_at' => 'datetime',
            'is_read'      => 'boolean',
        ];
    }

    public function license(): BelongsTo
    {
        return $this->belongsTo(License::class);
    }
}