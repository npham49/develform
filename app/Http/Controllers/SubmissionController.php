<?php

namespace App\Http\Controllers;

use App\Http\Requests\Submission\SubmissionCreateRequest;
use App\Models\Submission;
use App\Models\SubmissionToken;
use App\Models\Form;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
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

        // Generate token for anonymous submissions
        $token = null;
        if (!Auth::check()) {
            $submissionToken = SubmissionToken::generateForSubmission($submission);
            $token = $submissionToken->token;
        }

        // For anonymous submissions, redirect to success page with token
        if ($token) {
            return redirect()->route('submit.success', [
                'form' => $form->id,
                'submission' => $submission->id,
                'token' => $token
            ]);
        }

        // For authenticated users, render success page directly
        return redirect()->route('submit.success', [
            'form' => $form->id,
            'submission' => $submission->id,
        ]);
    }

    public function success(Form $form, Submission $submission)
    {
        $token = request()->query('token');

        // If user is authenticated, allow access to their own submissions
        if (Auth::check() && $submission->created_by === Auth::user()->id) {
            return Inertia::render('forms/success', [
                'submission_id' => $submission->id,
                'form_name' => $form->name,
                'submission_data' => $submission->data,
                'schema' => $form->schema,
                'created_at' => $submission->created_at,
            ]);
        }

        // For anonymous submissions, verify token
        if ($token && $submission->isAnonymous()) {
            $submissionToken = SubmissionToken::findByToken($token);

            if ($submissionToken && $submissionToken->submission_id === $submission->id) {
                return Inertia::render('forms/success', [
                    'submission_id' => $submission->id,
                    'form_name' => $form->name,
                    'submission_data' => $submission->data,
                    'schema' => $form->schema,
                    'created_at' => $submission->created_at,
                    'token' => $token,
                ]);
            }
        }

        return error('You are not authorized to view this submission');
    }
}
