<?php

test('returns a successful response for home and posts', function () {
    $homeResponse = $this->get(route('home'));
    $homeResponse->assertOk();
    expect($homeResponse->getContent())->toContain('/build/assets/');

    $postsResponse = $this->get('/posts');
    $postsResponse->assertOk();
    expect($postsResponse->getContent())->toContain('/build/assets/');
});
