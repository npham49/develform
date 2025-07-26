<?php

namespace App\Http\Requests\Version;

use Illuminate\Foundation\Http\FormRequest;

class VersionCreateRequest extends FormRequest
{
  public function authorize(): bool
  {
    return $this->user()->id === $this->route('form')->created_by;
  }

  public function rules(): array
  {
    return [
      'form_id' => 'required|exists:forms,id',
      'title' => 'required|string|max:255',
      'description' => 'nullable|string|max:1000',
      'data' => 'nullable|json',
      'differences' => 'nullable|json',
      'based_on' => 'nullable|exists:versions,version_number',
    ];
  }

  public function messages(): array
  {
    return [
      'form_id.required' => 'The form id is required.',
      'form_id.exists' => 'The form id must be an existing form id.',
      'title.required' => 'A title is required.',
      'title.string' => 'The title must be a string.',
      'title.max' => 'The title must be less than 255 characters.',
      'description.string' => 'The description must be a string.',
      'description.max' => 'The description must be less than 1000 characters.',
      'data.json' => 'The data must be a valid JSON object.',
      'differences.json' => 'The differences must be a valid JSON object.',
      'based_on.exists' => 'The based on version must be an existing version.',
    ];
  }
}