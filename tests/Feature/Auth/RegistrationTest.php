<?php

test('registration screen redirects to github login', function () {
    $response = $this->get('/register');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('auth/github-login'));
});