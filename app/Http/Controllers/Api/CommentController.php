<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreCommentRequest;
use App\Http\Requests\Api\UpdateCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    /**
     * Display a listing of comments for a post.
     */
    public function index(Post $post): AnonymousResourceCollection
    {
        $comments = $post->comments()
            ->with('user')
            ->latest()
            ->paginate(15);

        return CommentResource::collection($comments);
    }

    /**
     * Store a newly created comment on a post.
     */
    public function store(StoreCommentRequest $request, Post $post): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $comment = $post->comments()->create([
            'user_id' => $user->id,
            'content' => $request->validated('content'),
        ]);

        $comment->load('user');

        return (new CommentResource($comment))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update the specified comment.
     */
    public function update(UpdateCommentRequest $request, Comment $comment): CommentResource
    {
        Gate::authorize('update', $comment);

        $comment->update($request->validated());
        $comment->load('user');

        return new CommentResource($comment);
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(Comment $comment): JsonResponse
    {
        Gate::authorize('delete', $comment);

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully',
        ]);
    }
}
