<?php

namespace App\Http\Requests\Version;

use Illuminate\Foundation\Http\FormRequest;

class VersionUpdateRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->id === $this->route('form')->created_by;
  }

  public function rules(): array
  {
    return [
      'title' => 'nullable|string|max:255',
      'description' => 'nullable|string|max:1000',
      'data' => 'required|json',
      'differences' => 'nullable|json',
    ];
  }

  public function messages(): array
  {
    return [
      'form_id.required' => 'The form id is required.',
      'form_id.exists' => 'The form id must be an existing form id.',
      'title.string' => 'The title must be a string.',
      'title.max' => 'The title must be less than 255 characters.',
      'description.string' => 'The description must be a string.',
      'description.max' => 'The description must be less than 1000 characters.',
      'data.required' => 'The data is required.',
      'data.json' => 'The data must be a valid JSON object.',
      'differences.json' => 'The differences must be a valid JSON object.',
    ];
  }
}