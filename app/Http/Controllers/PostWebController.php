<?php

namespace App\Http\Controllers;

use App\Http\Requests\Api\StoreCommentRequest;
use App\Http\Requests\Api\StorePostRequest;
use App\Http\Requests\Api\UpdatePostRequest;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PostWebController extends Controller
{
    /**
     * Display a listing of posts for the web interface.
     */
    public function index(Request $request): Response
    {
        $query = Post::query()
            ->with('user:id,name,email')
            ->withCount('comments');

        if ($request->filled('search')) {
            $search = (string) $request->query('search');
            $query->where(function ($q) use ($search): void {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $posts = $query->where('status', 'published')
            ->latest()
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('posts/index', [
            'posts' => $posts,
            'filters' => [
                'search' => $request->query('search', ''),
            ],
        ]);
    }

    /**
     * Display the specified post with its comments.
     */
    public function show(Post $post): Response
    {
        $post->load([
            'user:id,name,email',
            'comments' => fn ($query) => $query->with('user:id,name,email')->latest(),
        ]);

        return Inertia::render('posts/show', [
            'post' => $post,
        ]);
    }

    /**
     * Store a newly created post from the web dashboard.
     */
    public function store(StorePostRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $validated = $request->validated();

        $baseSlug = Str::slug($validated['title']);
        $uniqueSlug = $baseSlug.'-'.Str::lower(Str::random(6));

        $user->posts()->create([
            'title' => $validated['title'],
            'slug' => $uniqueSlug,
            'content' => $validated['content'],
            'status' => $validated['status'] ?? 'published',
        ]);

        return back()->with('success', 'Post created successfully!');
    }

    /**
     * Update the specified post from the web interface.
     */
    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        Gate::authorize('update', $post);

        $validated = $request->validated();

        if (isset($validated['title']) && $validated['title'] !== $post->title) {
            $validated['slug'] = Str::slug($validated['title']).'-'.Str::lower(Str::random(6));
        }

        $post->update($validated);

        return back()->with('success', 'Post updated successfully!');
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post): RedirectResponse
    {
        Gate::authorize('delete', $post);

        $post->delete();

        return redirect()->route('posts.index')->with('success', 'Post deleted successfully!');
    }

    /**
     * Store a comment on a post from the web UI.
     */
    public function storeComment(StoreCommentRequest $request, Post $post): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $post->comments()->create([
            'user_id' => $user->id,
            'content' => $request->validated('content'),
        ]);

        return back()->with('success', 'Comment added successfully!');
    }

    /**
     * Delete a comment from the web UI.
     */
    public function destroyComment(Comment $comment): RedirectResponse
    {
        Gate::authorize('delete', $comment);

        $comment->delete();

        return back()->with('success', 'Comment removed successfully!');
    }
}
