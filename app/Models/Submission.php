<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $form_id
 * @property array<array-key, mixed> $data
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $version_id
 * @property-read \App\Models\User|null $createdBy
 * @property-read \App\Models\Form $form
 * @property-read string $creator_name
 * @property-read \App\Models\SubmissionToken|null $submissionToken
 * @property-read \App\Models\User|null $updatedBy
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereFormId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Submission whereVersionId($value)
 * @mixin \Eloquent
 */
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

    // relation to submission token (for anonymous submissions)
    public function submissionToken()
    {
        return $this->hasOne(SubmissionToken::class);
    }
}
