<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    /**
     * Redirect to GitHub for authentication
     */
    public function redirectToGithub(Request $request): RedirectResponse
    {
        // Store the intended URL in session if provided
        if ($request->has('redirect')) {
            session(['intended_url' => $request->get('redirect')]);
        }

        return Socialite::driver('github')->redirect();
    }

    /**
     * Handle the GitHub callback
     */
    public function handleGithubCallback(Request $request): RedirectResponse
    {
        try {
            $githubUser = Socialite::driver('github')->user();
        } catch (\Exception $e) {
            Log::error('GitHub OAuth callback error: ' . $e->getMessage());
            return redirect()->route('login')->with('error', 'Authentication failed. Please try again.');
        }

        // Find or create user
        $user = User::where('github_id', $githubUser->getId())->first();

        if (!$user) {
            // Check if a user with this email already exists (only if email is provided)
            $existingUser = null;
            if ($githubUser->getEmail()) {
                $existingUser = User::where('email', $githubUser->getEmail())->first();
            }
            
            if ($existingUser) {
                // Update existing user with GitHub data
                $existingUser->update([
                    'github_id' => $githubUser->getId(),
                    'avatar_url' => $githubUser->getAvatar(),
                ]);
                $user = $existingUser;
            } else {
                // Create new user
                $user = User::create([
                    'name' => $this->getUserName($githubUser),
                    'email' => $githubUser->getEmail(), // Can be null
                    'github_id' => $githubUser->getId(),
                    'avatar_url' => $githubUser->getAvatar(),
                    'email_verified_at' => $this->getEmailVerificationDate($githubUser),
                ]);
            }
        } else {
            // Update existing GitHub user's data
            $user->update([
                'name' => $this->getUserName($githubUser),
                'email' => $githubUser->getEmail(), // Can be null
                'avatar_url' => $githubUser->getAvatar(),
                'email_verified_at' => $this->getEmailVerificationDate($githubUser),
            ]);
        }

        // Log the user in
        Auth::login($user, true);

        // Redirect to intended URL or dashboard
        $intendedUrl = session()->pull('intended_url', route('dashboard', absolute: false));
        
        return redirect()->intended($intendedUrl);
    }

    /**
     * Get user name with proper fallbacks to ensure it's never null
     */
    private function getUserName($githubUser): string
    {
        // Try name first, then nickname, then email username, finally fallback to GitHub username
        return $githubUser->getName() 
            ?? $githubUser->getNickname() 
            ?? ($githubUser->getEmail() ? explode('@', $githubUser->getEmail())[0] : null)
            ?? 'GitHub User ' . $githubUser->getId();
    }

    /**
     * Get email verification date based on GitHub's actual verification status
     */
    private function getEmailVerificationDate($githubUser): ?string
    {
        // If no email, return null
        if (!$githubUser->getEmail()) {
            return null;
        }

        // For security and accuracy, we should not automatically mark emails as verified
        // without proper verification from GitHub's API. GitHub provides email verification
        // status through their /user/emails endpoint, but this requires an additional API call.
        // 
        // For now, we'll be conservative and not mark emails as verified by default.
        // This follows the principle of least privilege and ensures we don't incorrectly
        // mark unverified emails as verified.
        // 
        // In the future, if email verification is critical, we could:
        // 1. Make an additional API call to GitHub's /user/emails endpoint
        // 2. Request the 'user:email' scope to get detailed email information
        // 3. Check the 'verified' field in the response
        
        return null;
    }
}
