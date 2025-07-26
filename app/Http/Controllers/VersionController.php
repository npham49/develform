<?php

namespace App\Http\Controllers;

use App\Http\Requests\Version\VersionCreateRequest;
use App\Http\Requests\Version\VersionUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Version;
use App\Models\Form;
use Inertia\Inertia;

class VersionController extends Controller
{

  public function get_all_form_versions(Form $form)
  {
    $versions = $form->versions()->get();
    return redirect()->back()->with([
      'versions' => $versions,
    ]);
  }

  public function schema(Form $form, Version $version)
  {
    return Inertia::render('forms/schema', [
      'form' => $form,
      'version' => $version,
    ]);
  }

  public function update_schema(VersionUpdateRequest $request, Form $form, Version $version)
  {

    // making sure version is not live for update
    if ($version->is_live) {
      return redirect()->back()->withErrors([
        'error' => 'You cannot update a live version',
      ]);
    }

    $validatedData = $request->validated();
    $validatedData['updated_by'] = Auth::user()->id;
    $version->update($validatedData);
    return redirect()->back()->with([
      'version' => $version,
    ]);
  }

  public function store(VersionCreateRequest $request, Form $form)
  {

    // Set the user id
    $validatedData = $request->validated();
    $validatedData['created_by'] = Auth::user()->id;
    $validatedData['updated_by'] = Auth::user()->id;

    // get the previous version
    $previousVersion = Version::where('form_id', $form->id)->where('version_number', $validatedData['based_on'])->first();

    // handle the version metadata
    $validatedData['is_live'] = false;
    $validatedData['version_number'] = $form->versions()->count() + 1;
    // differences are to be set when the version is published
    $validatedData['differences'] = [
      "created" => [],
      "updated" => [],
      "deleted" => []
    ];

    try {
      $version = DB::transaction(function () use ($validatedData, $previousVersion, $form) {
        // un live the previous version
        if (null !== $previousVersion) {
          $validatedData['data'] = $previousVersion->data;
        }

        // create the new version
        $version = Version::create($validatedData);

        return $version;
      });
    } catch (\Exception $e) {
      return redirect()->back()->withErrors([
        'error' => $e->getMessage(),
      ]);
    }

    // return the new version
    return redirect()->back()->with([
      'version' => $version,
    ]);
  }

  public function update(VersionUpdateRequest $request, Version $version)
  {
    $validatedData = $request->validated();
    $validatedData['updated_by'] = Auth::user()->id;

    $version->update($validatedData);

    return redirect()->back()->with([
      'version' => $version,
    ]);
  }

  public function publish(Version $version, Form $form)
  {

    // get the previous version
    $previousVersion = $form->version;
    $previousVersion->is_live = false;

    // update the form with the new version
    $form['version_id'] = $version->id;

    // update the differences
    $version->is_live = true;
    // This is when we generate the differences list
    // Placeholder code for now
    $version->differences = [
      "created" => [],
      "updated" => [],
      "deleted" => []
    ];

    try {
      $version = DB::transaction(function () use ($version, $previousVersion, $form) {
        // update the form with the new version

        $previousVersion->save();
        $version->save();
        $form->save();

        return $version;
      });
    } catch (\Exception $e) {
      return redirect()->back()->withErrors([
        'error' => $e->getMessage(),
      ]);
    }

    return redirect()->back()->with([
      'version' => $version,
    ]);
  }
}