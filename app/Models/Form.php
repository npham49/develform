<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{

    //
    protected $table = 'forms';

    protected $fillable = [
        'name',
        'description',
        'is_public',
        'schema',
        'created_by',
        'updated_by',
    ];

    // relation to user
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
