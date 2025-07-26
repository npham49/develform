<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property bool $is_public
 * @property string|null $schema
 * @property int $version_id
 * @property int $created_by
 * @property int $updated_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $createdBy
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Submission> $submissions
 * @property-read int|null $submissions_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form whereCreatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form whereIsPublic($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form whereSchema($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form whereUpdatedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Form whereVersionId($value)
 * @mixin \Eloquent
 */
class Form extends Model
{

    //
    protected $table = 'forms';

    protected $fillable = [
        'name',
        'description',
        'is_public',
        'schema',
        'version_id',
        'created_by',
        'updated_by',
    ];

    // relation to user
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // relation to version
    public function version()
    {
        return $this->belongsTo(Version::class, 'version_id');
    }

    // relation to versions
    public function versions()
    {
        return $this->hasMany(Version::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
