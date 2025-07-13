<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class SubmissionCreateRequest extends FormRequest
{
    /** 
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'form_id' => 'required|exists:forms,id',
            'data' => 'required|array',
        ];
    }

    public function messages(): array
    {
        return [
            'form_id.required' => 'The form id field is required.',
            'form_id.exists' => 'The form id field must be an existing form id.',
            'data.required' => 'The data field is required.',
            'data.array' => 'The data field must be an array.',
        ];
    }
}
