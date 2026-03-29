<?php

namespace App\Models;

use App\Enums\SoftwareCategory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Software extends Model
{
    protected $table = 'softwares';

    protected $fillable = [
        'name',
        'vendor',
        'category',
        'logo_url',
        'website',
    ];

    protected function casts(): array
    {
        return [
            'category' => SoftwareCategory::class,
        ];
    }

    public function licenses(): HasMany
    {
        return $this->hasMany(License::class);
    }
}