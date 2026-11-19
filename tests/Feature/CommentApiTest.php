<?php

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('anyone can list comments for a post', function () {
    $post = Post::factory()->create();
    Comment::factory()->count(3)->for($post)->create();

    $response = $this->getJson("/api/posts/{$post->id}/comments");

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'post_id', 'user_id', 'content', 'created_at', 'updated_at', 'user'],
            ],
            'links',
            'meta',
        ]);
});

test('authenticated user can add a comment to a post', function () {
    $post = Post::factory()->create();
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $response = $this->postJson("/api/posts/{$post->id}/comments", [
        'content' => 'Great post! Thanks for sharing.',
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.content', 'Great post! Thanks for sharing.')
        ->assertJsonPath('data.post_id', $post->id)
        ->assertJsonPath('data.user_id', $user->id);

    $this->assertDatabaseHas('comments', [
        'post_id' => $post->id,
        'user_id' => $user->id,
        'content' => 'Great post! Thanks for sharing.',
    ]);
});

test('guest cannot comment on a post', function () {
    $post = Post::factory()->create();

    $response = $this->postJson("/api/posts/{$post->id}/comments", [
        'content' => 'Unauthorized comment',
    ]);

    $response->assertUnauthorized();
});

test('author can update their comment', function () {
    $user = User::factory()->create();
    $comment = Comment::factory()->for($user)->create([
        'content' => 'Old comment text',
    ]);

    Sanctum::actingAs($user);

    $response = $this->putJson("/api/comments/{$comment->id}", [
        'content' => 'Edited comment text',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.content', 'Edited comment text');

    $this->assertDatabaseHas('comments', [
        'id' => $comment->id,
        'content' => 'Edited comment text',
    ]);
});

test('non author cannot update comment', function () {
    $author = User::factory()->create();
    $otherUser = User::factory()->create();
    $comment = Comment::factory()->for($author)->create();

    Sanctum::actingAs($otherUser);

    $response = $this->putJson("/api/comments/{$comment->id}", [
        'content' => 'Malicious edit',
    ]);

    $response->assertForbidden();
});

test('comment author can delete comment', function () {
    $user = User::factory()->create();
    $comment = Comment::factory()->for($user)->create();

    Sanctum::actingAs($user);

    $response = $this->deleteJson("/api/comments/{$comment->id}");

    $response->assertOk()
        ->assertJson(['message' => 'Comment deleted successfully']);

    $this->assertDatabaseMissing('comments', [
        'id' => $comment->id,
    ]);
});

test('post owner can delete comments on their post', function () {
    $postOwner = User::factory()->create();
    $post = Post::factory()->for($postOwner)->create();
    $commenter = User::factory()->create();
    $comment = Comment::factory()->for($post)->for($commenter)->create();

    Sanctum::actingAs($postOwner);

    $response = $this->deleteJson("/api/comments/{$comment->id}");

    $response->assertOk()
        ->assertJson(['message' => 'Comment deleted successfully']);

    $this->assertDatabaseMissing('comments', [
        'id' => $comment->id,
    ]);
});
