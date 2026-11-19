<?php

use App\Models\Post;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('anyone can list published posts', function () {
    Post::factory()->count(3)->create(['status' => 'published']);
    Post::factory()->create(['status' => 'draft']);

    $response = $this->getJson('/api/posts');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'user_id', 'title', 'slug', 'content', 'status', 'created_at', 'updated_at', 'user'],
            ],
            'links',
            'meta',
        ]);
});

test('anyone can view a single post', function () {
    $post = Post::factory()->create();

    $response = $this->getJson("/api/posts/{$post->id}");

    $response->assertOk()
        ->assertJsonPath('data.id', $post->id)
        ->assertJsonPath('data.title', $post->title);
});

test('authenticated user can create a post', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/posts', [
        'title' => 'My First API Post',
        'content' => 'This is the detailed post content for testing.',
        'status' => 'published',
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.title', 'My First API Post')
        ->assertJsonPath('data.user_id', $user->id);

    $this->assertDatabaseHas('posts', [
        'title' => 'My First API Post',
        'user_id' => $user->id,
    ]);
});

test('guest cannot create a post', function () {
    $response = $this->postJson('/api/posts', [
        'title' => 'Unauthorized Post',
        'content' => 'Content here',
    ]);

    $response->assertUnauthorized();
});

test('author can update their post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->for($user)->create([
        'title' => 'Original Title',
    ]);

    Sanctum::actingAs($user);

    $response = $this->putJson("/api/posts/{$post->id}", [
        'title' => 'Updated Title',
        'content' => 'Updated content.',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.title', 'Updated Title');

    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'title' => 'Updated Title',
    ]);
});

test('user cannot update someone else post', function () {
    $author = User::factory()->create();
    $otherUser = User::factory()->create();
    $post = Post::factory()->for($author)->create();

    Sanctum::actingAs($otherUser);

    $response = $this->putJson("/api/posts/{$post->id}", [
        'title' => 'Malicious Update',
    ]);

    $response->assertForbidden();
});

test('author can delete their post', function () {
    $user = User::factory()->create();
    $post = Post::factory()->for($user)->create();

    Sanctum::actingAs($user);

    $response = $this->deleteJson("/api/posts/{$post->id}");

    $response->assertOk()
        ->assertJson(['message' => 'Post deleted successfully']);

    $this->assertDatabaseMissing('posts', [
        'id' => $post->id,
    ]);
});
