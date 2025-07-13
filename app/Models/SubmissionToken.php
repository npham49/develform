<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SubmissionToken extends Model
{
    protected $table = 'submission_tokens';

    protected $fillable = [
        'submission_id',
        'token',
    ];

    /**
     * Relationship to submission
     */
    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    /**
     * Generate a new token for a submission
     */
    public static function generateForSubmission(Submission $submission): self
    {
        return self::create([
            'submission_id' => $submission->id,
            'token' => self::generateToken(),
        ]);
    }

    /**
     * Generate a unique token
     */
    public static function generateToken(): string
    {
        do {
            $token = Str::random(32);
        } while (self::where('token', $token)->exists());

        return $token;
    }

    /**
     * Find submission by token
     */
    public static function findByToken(string $token): ?self
    {
        return self::where('token', $token)->first();
    }
}
