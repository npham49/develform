<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubmissionCreateRequest;
use App\Models\Submission;
use App\Models\Form;
use Illuminate\Support\Facades\Auth;
use function Laravel\Prompts\error;

class SubmissionController extends Controller
{
    //
    public function store(SubmissionCreateRequest $request)
    {

        // check if the form is public
        $form = Form::find($request->form_id);
        if (!$form->is_public && !Auth::check()) {
            return error('You must be logged in to submit this form');
        }

        $validatedData = $request->validated();
        $validatedData['created_by'] = Auth::user()->id ?? null;
        $validatedData['updated_by'] = Auth::user()->id ?? null;

        $submission = Submission::create($validatedData);

        return response()->json($submission);
    }
}
