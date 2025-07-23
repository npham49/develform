<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $form_id
 * @property string $title
 * @property string|null $description
 * @property string $data
 * @property int $created_by
 * @property int $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Version newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Version newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Version query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Version whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Version whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Version whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Version whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Version whereFormId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Version whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Version whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Version whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Version whereUpdatedBy($value)
 * @mixin \Eloquent
 */
class Version extends Model
{
    //
    protected $table = 'versions';

    protected $fillable = [
        'form_id',
        'version_number',
        'title',
        'description',
        'data',
        'differences',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'data' => 'array',
        'differences' => 'array',
    ];

    // relation to form
    public function form()
    {
        return $this->belongsTo(Form::class);
    }

    // relation to user
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // relation to user
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
