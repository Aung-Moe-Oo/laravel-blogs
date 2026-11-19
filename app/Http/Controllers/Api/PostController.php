<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StorePostRequest;
use App\Http\Requests\Api\UpdatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * Display a listing of posts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Post::query()->with('user');

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where(function ($q) use ($search): void {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', (int) $request->query('user_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', (string) $request->query('status'));
        } else {
            $query->where('status', 'published');
        }

        $perPage = (int) $request->query('per_page', 10);
        $posts = $query->latest()->paginate(max(1, min($perPage, 100)));

        return PostResource::collection($posts);
    }

    /**
     * Store a newly created post in storage.
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validated();
        $baseSlug = Str::slug($validated['title']);
        $uniqueSlug = $baseSlug.'-'.Str::lower(Str::random(6));

        $post = $user->posts()->create([
            'title' => $validated['title'],
            'slug' => $uniqueSlug,
            'content' => $validated['content'],
            'status' => $validated['status'] ?? 'published',
        ]);

        $post->load('user');

        return (new PostResource($post))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified post with comments.
     */
    public function show(Post $post): PostResource
    {
        $post->load(['user', 'comments.user']);

        return new PostResource($post);
    }

    /**
     * Update the specified post in storage.
     */
    public function update(UpdatePostRequest $request, Post $post): PostResource
    {
        Gate::authorize('update', $post);

        $validated = $request->validated();

        if (isset($validated['title']) && $validated['title'] !== $post->title) {
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::lower(Str::random(6));
        }

        $post->update($validated);
        $post->load(['user', 'comments.user']);

        return new PostResource($post);
    }

    /**
     * Remove the specified post from storage.
     */
    public function destroy(Post $post): JsonResponse
    {
        Gate::authorize('delete', $post);

        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully',
        ]);
    }
}
