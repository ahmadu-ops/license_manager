<?php

namespace App\Http\Requests;

use App\Enums\SoftwareCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSoftwareRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:255'],
            'vendor'   => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(SoftwareCategory::class)],
            'website'  => ['nullable', 'url', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Le nom du logiciel est requis.',
            'vendor.required'   => 'L\'éditeur est requis.',
            'category.required' => 'La catégorie est requise.',
            'website.url'       => 'L\'URL du site n\'est pas valide.',
        ];
    }
}