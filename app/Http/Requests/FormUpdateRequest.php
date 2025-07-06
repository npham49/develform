<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FormUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // only allow the owner to update the form
        return $this->user()->id === $this->form->created_by;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'string|max:255',
            'description' => 'string|max:255',
            'is_public' => 'boolean',
            'schema' => 'json',
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'The name field must be a string.',
            'name.max' => 'The name field must be less than 255 characters.',
            'description.string' => 'The description field must be a string.',
            'description.max' => 'The description field must be less than 255 characters.',
            'is_public.boolean' => 'The is_public field must be a boolean.',
            'schema.json' => 'The schema field must be a valid JSON object.',
        ];
    }
}
