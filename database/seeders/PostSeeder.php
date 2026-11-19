<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $users = User::factory()->count(3)->create();
        }

        foreach ($users as $user) {
            Post::factory()
                ->count(3)
                ->for($user)
                ->create()
                ->each(function (Post $post) use ($users): void {
                    Comment::factory()
                        ->count(2)
                        ->for($post)
                        ->for($users->random())
                        ->create();
                });
        }
    }
}
