<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\FormCreateRequest;
use App\Http\Requests\FormUpdateRequest;
use Illuminate\Support\Facades\Log;
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
        return Inertia::render('forms/manage', [
            'form' => $form,
        ]);
    }

    public function schema(Form $form)
    {
        return Inertia::render('forms/schema', [
            'form' => $form,
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
        $request->merge(['updated_by' => $request->user()->id]);
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
