<?php

use App\Models\User;

test('github login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('auth/github-login'));
});

test('users can logout', function () {
    $user = User::factory()->create([
        'github_id' => '123456',
        'password' => null,
    ]);

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});

test('github auth redirect works', function () {
    $response = $this->get('/auth/github');

    $response->assertStatus(302);
    $response->assertRedirectContains('github.com');
});