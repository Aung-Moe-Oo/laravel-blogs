<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Sanctum\PersonalAccessToken;

class DashboardController extends Controller
{
    /**
     * Display the dashboard view with blog metrics and user resources.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $stats = [
            'total_posts' => Post::count(),
            'total_comments' => Comment::count(),
            'total_users' => User::count(),
            'my_posts' => $user->posts()->count(),
        ];

        $recentPosts = Post::query()
            ->with('user:id,name,email')
            ->withCount('comments')
            ->latest()
            ->take(8)
            ->get();

        $myPosts = $user->posts()
            ->withCount('comments')
            ->latest()
            ->take(10)
            ->get();

        $tokens = $user->tokens()
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'created_at', 'last_used_at']);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentPosts' => $recentPosts,
            'myPosts' => $myPosts,
            'tokens' => $tokens,
            'newApiToken' => session('newApiToken'),
        ]);
    }

    /**
     * Generate a new API token for the authenticated user to test in Swagger / REST API.
     */
    public function createApiToken(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'token_name' => ['required', 'string', 'max:50'],
        ]);

        /** @var User $user */
        $user = $request->user();

        $token = $user->createToken($validated['token_name'])->plainTextToken;

        return back()->with('newApiToken', [
            'name' => $validated['token_name'],
            'token' => $token,
        ]);
    }

    /**
     * Revoke an API token.
     */
    public function deleteApiToken(Request $request, PersonalAccessToken $token): RedirectResponse
    {
        if ($token->tokenable_id === $request->user()?->id) {
            $token->delete();
        }

        return back();
    }
}
