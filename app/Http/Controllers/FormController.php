<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\FormCreateRequest;

class FormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $forms = Form::all();
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
        $form = Form::create($request->validated());

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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Form $form)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Form $form)
    {
        //
    }
}
