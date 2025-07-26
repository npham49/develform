<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Inertia\Inertia;
use App\Http\Requests\FormCreateRequest;
use App\Http\Requests\FormUpdateRequest;
use App\Models\Version;
use Illuminate\Support\Facades\Auth;
use function Laravel\Prompts\error;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $forms = Form::where('created_by', '=', Auth::user()->id)->get();
        return Inertia::render('forms/index', [
            'forms' => $forms,
        ]);
    }

    /**
     * Get the form schema, return the schema and name without auth if the form is public,
     * otherwise only return the schema if the user is authenticated
     */
    public function get_schema(Form $form)
    {
        if ($form->is_public) {
            return Inertia::render('forms/submit', [
                'name' => $form->name,
                'form_id' => $form->id,
            ]);
        }

        if (!$form->is_public && Auth::check()) {
            return Inertia::render('forms/submit', [
                'name' => $form->name,
                'form_id' => $form->id,
            ]);
        }

        return redirect()->route('login', ['redirect' => route('submit', $form->id)]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('forms/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FormCreateRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['created_by'] = Auth::user()->id;
        $validatedData['updated_by'] = Auth::user()->id;

        $form = Form::create($validatedData);

        if ($form) {
            return redirect()->route('forms.manage', $form)->with('success', 'Form created successfully');
        }

        return redirect()->back()->with('error', 'Failed to create form');
    }

    /**
     * Display the specified resource.
     */
    public function show(Form $form)
    {
        // check if the user is the owner of the form
        if (Auth::user()->id !== $form->created_by) {
            return redirect()->route('forms.index')->withErrors([
                'error' => 'You are not authorized to manage this form',
            ]);
        }

        $versions = $form->versions()->orderBy('created_at', 'desc')->get();
        return Inertia::render('forms/manage', [
            'form' => $form,
            'versions' => $versions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Form $form)
    {
        //
    }

    public function update(FormUpdateRequest $request, Form $form)
    {
        if (Auth::user()->id !== $form->created_by) {
            return error('You are not authorized to update this form');
        }
        $request->merge(['updated_by' => Auth::user()->id]);
        $updated = $form->update($request->validated());

        if ($updated) {
            return redirect()->back()->with('success', 'Form updated successfully');
        }

        return error('Failed to update form');
    }

    public function preview(Form $form)
    {
        return Inertia::render('forms/preview', [
            'form' => $form,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Form $form)
    {
        //
    }
}
