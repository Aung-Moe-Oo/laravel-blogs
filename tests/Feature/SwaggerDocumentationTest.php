<?php

test('swagger ui documentation page is accessible', function () {
    $response = $this->get('/api/documentation');

    $response->assertOk()
        ->assertSee('SwaggerUIBundle')
        ->assertSee('/docs/api.json');
});

test('openapi json spec is available and includes blog endpoints', function () {
    $response = $this->get('/docs/api.json');

    $response->assertOk()
        ->assertJsonStructure([
            'openapi',
            'info',
            'paths',
        ]);

    $content = $response->json();

    expect($content['paths'])->toHaveKey('/register')
        ->toHaveKey('/login')
        ->toHaveKey('/posts')
        ->toHaveKey('/posts/{post}')
        ->toHaveKey('/posts/{post}/comments')
        ->toHaveKey('/comments/{comment}');
});

test('scramble documentation ui is accessible', function () {
    $response = $this->get('/docs/api');

    $response->assertOk();
});
