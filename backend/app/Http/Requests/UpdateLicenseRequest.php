<?php

namespace App\Http\Requests;

use App\Enums\LicenseStatus;
use App\Enums\LicenseType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLicenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'software_id'  => ['sometimes', 'exists:softwares,id'],
            'license_key'  => ['sometimes', 'string', 'max:500'],
            'type'         => ['sometimes', Rule::enum(LicenseType::class)],
            'seats'        => ['sometimes', 'integer', 'min:1'],
            'status'       => ['sometimes', Rule::enum(LicenseStatus::class)],
            'purchased_at' => ['sometimes', 'date'],
            'expires_at'   => ['nullable', 'date'],
            'cost'         => ['sometimes', 'numeric', 'min:0'],
            'notes'        => ['nullable', 'string', 'max:2000'],
        ];
    }
}