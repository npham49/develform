<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    //
    protected $table = 'submissions';

    protected $fillable = [
        'form_id',
        'data',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    // relation to form
    public function form()
    {
        return $this->belongsTo(Form::class);
    }

    // optional relation to user (can be null for anonymous submissions)
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // optional relation to user (can be null for anonymous submissions)
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // helper method to check if submission was created by an authenticated user
    public function isCreatedByUser(): bool
    {
        return !is_null($this->created_by);
    }

    // helper method to check if submission is anonymous
    public function isAnonymous(): bool
    {
        return is_null($this->created_by);
    }

    // helper method to get creator name or "Anonymous"
    public function getCreatorNameAttribute(): string
    {
        return $this->createdBy ? $this->createdBy->name : 'Anonymous';
    }
}
