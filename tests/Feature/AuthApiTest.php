<?php

use App\Models\User;

test('users can register via api', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'user' => ['id', 'name', 'email'],
            'access_token',
            'token_type',
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
    ]);
});

test('registration requires valid input', function () {
    $response = $this->postJson('/api/register', [
        'name' => '',
        'email' => 'not-an-email',
        'password' => 'short',
        'password_confirmation' => 'mismatch',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});

test('users can login via api', function () {
    $user = User::factory()->create([
        'email' => 'jane@example.com',
        'password' => 'secret123',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'jane@example.com',
        'password' => 'secret123',
    ]);

    $response->assertOk()
        ->assertJsonStructure([
            'message',
            'user' => ['id', 'name', 'email'],
            'access_token',
            'token_type',
        ]);
});

test('login fails with invalid credentials', function () {
    User::factory()->create([
        'email' => 'jane@example.com',
        'password' => 'secret123',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'jane@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('authenticated user can view profile and logout', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test_token')->plainTextToken;

    $meResponse = $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/me');

    $meResponse->assertOk()
        ->assertJsonPath('user.email', $user->email);

    $logoutResponse = $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/logout');

    $logoutResponse->assertOk()
        ->assertJson(['message' => 'Logged out successfully']);
});
