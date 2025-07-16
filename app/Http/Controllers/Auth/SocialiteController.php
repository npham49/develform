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
                    'name' => $githubUser->getName() ?? $githubUser->getNickname(),
                    'email' => $githubUser->getEmail(), // Can be null
                    'github_id' => $githubUser->getId(),
                    'avatar_url' => $githubUser->getAvatar(),
                    'email_verified_at' => $githubUser->getEmail() ? now() : null, // Only mark verified if email exists
                ]);
            }
        } else {
            // Update existing GitHub user's data
            $user->update([
                'name' => $githubUser->getName() ?? $githubUser->getNickname(),
                'email' => $githubUser->getEmail(), // Can be null
                'avatar_url' => $githubUser->getAvatar(),
                'email_verified_at' => $githubUser->getEmail() ? now() : null,
            ]);
        }

        // Log the user in
        Auth::login($user, true);

        // Redirect to intended URL or dashboard
        $intendedUrl = session()->pull('intended_url', route('dashboard', absolute: false));
        
        return redirect()->intended($intendedUrl);
    }
}
