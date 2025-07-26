<?php

namespace App\Http\Controllers;

use App\Http\Requests\Version\VersionCreateRequest;
use App\Http\Requests\Version\VersionUpdateRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Version;
use App\Models\Form;

class VersionController extends Controller
{

  public function get_all_form_versions(Form $form)
  {
    $versions = $form->versions()->get();
    return response()->json([
      'versions' => $versions,
    ]);
  }

  public function store(VersionCreateRequest $request, Form $form)
  {
    // Set the user id
    $validatedData = $request->validated();
    $validatedData['created_by'] = Auth::user()->id;
    $validatedData['updated_by'] = Auth::user()->id;

    // get the previous version
    $previousVersion = $form->version;

    // handle the version metadata
    $validatedData['is_live'] = true;
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
      return response()->json([
        'error' => $e->getMessage(),
      ], 500);
    }

    // return the new version
    return response()->json([
      'version' => $version,
    ]);
  }

  public function update(VersionUpdateRequest $request, Version $version)
  {
    $validatedData = $request->validated();
    $validatedData['updated_by'] = Auth::user()->id;

    $version->update($validatedData);

    return response()->json([
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
      return response()->json([
        'error' => $e->getMessage(),
      ], 500);
    }

    return response()->json([
      'version' => $version,
    ]);
  }
}