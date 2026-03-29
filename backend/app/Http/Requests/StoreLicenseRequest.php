<?php

namespace App\Http\Requests;

use App\Enums\LicenseStatus;
use App\Enums\LicenseType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLicenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'software_id'  => ['required', 'exists:softwares,id'],
            'license_key'  => ['required', 'string', 'max:500'],
            'type'         => ['required', Rule::enum(LicenseType::class)],
            'seats'        => ['required', 'integer', 'min:1'],
            'status'       => ['sometimes', Rule::enum(LicenseStatus::class)],
            'purchased_at' => ['required', 'date'],
            'expires_at'   => ['nullable', 'date', 'after_or_equal:purchased_at'],
            'cost'         => ['required', 'numeric', 'min:0'],
            'notes'        => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'software_id.required'      => 'Le logiciel est requis.',
            'license_key.required'      => 'La clé de licence est requise.',
            'type.required'             => 'Le type est requis.',
            'seats.min'                 => 'Minimum 1 siège.',
            'purchased_at.required'     => 'Date d\'achat requise.',
            'expires_at.after_or_equal' => 'L\'expiration doit être après l\'achat.',
            'cost.required'             => 'Le coût est requis.',
        ];
    }
}