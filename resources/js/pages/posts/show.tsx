import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    FileText,
    MessageSquare,
    Send,
    Trash2,
    User as UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CommentItem {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface PostItem {
    id: number;
    user_id: number;
    title: string;
    slug: string;
    content: string;
    status: string;
    created_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    comments: CommentItem[];
}

interface PostShowProps {
    post: PostItem;
}

export default function PostShow({ post }: PostShowProps) {
    const { auth } = usePage().props as {
        auth?: {
            user?: {
                id: number;
                name: string;
                email: string;
            };
        };
    };

    const commentForm = useForm({
        content: '',
    });

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        commentForm.post(`/posts/${post.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => commentForm.reset(),
        });
    };

    const handleDeletePost = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            useForm().delete(`/posts/${post.id}`);
        }
    };

    const handleDeleteComment = (commentId: number) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            useForm().delete(`/comments/${commentId}`, {
                preserveScroll: true,
            });
        }
    };

    const isAuthor = auth?.user?.id === post.user_id;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
            <Head title={`${post.title} - Blog`} />

            {/* Top Navigation */}
            <header className="border-b bg-white dark:bg-neutral-900 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/posts" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Articles
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        {auth?.user ? (
                            <Button size="sm" variant="outline" asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        ) : (
                            <Button size="sm" asChild>
                                <Link href="/login">Log in</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Article Content */}
            <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
                <article className="bg-white dark:bg-neutral-900 rounded-xl border p-6 sm:p-10 shadow-xs space-y-6">
                    {/* Meta info */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 font-bold">
                                {post.user?.name ? post.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <div className="font-semibold text-sm">{post.user?.name || 'Anonymous Author'}</div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{post.comments.length} comments</span>
                                </div>
                            </div>
                        </div>

                        {isAuthor && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleDeletePost}
                            >
                                <Trash2 className="h-4 w-4 mr-1.5" />
                                Delete Post
                            </Button>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                        {post.title}
                    </h1>

                    {/* Body */}
                    <div className="prose dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
                        {post.content}
                    </div>

                    {/* REST API Hint */}
                    <div className="border-t pt-4 text-xs text-muted-foreground flex items-center justify-between">
                        <span>Post ID: #{post.id} • Slug: <code className="font-mono">{post.slug}</code></span>
                        <a
                            href={`/api/posts/${post.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 hover:underline flex items-center gap-1"
                        >
                            <FileText className="h-3 w-3" />
                            View Raw REST JSON
                        </a>
                    </div>
                </article>

                {/* Comments Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-sky-600" />
                        <h2 className="text-xl font-bold tracking-tight">
                            Comments ({post.comments.length})
                        </h2>
                    </div>

                    {/* New Comment Box */}
                    {auth?.user ? (
                        <Card>
                            <CardHeader className="pb-3">
                                <span className="text-sm font-medium">Leave a response as {auth.user.name}</span>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCommentSubmit} className="space-y-3">
                                    <textarea
                                        rows={3}
                                        placeholder="What are your thoughts on this post?"
                                        value={commentForm.data.content}
                                        onChange={(e) => commentForm.setData('content', e.target.value)}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        required
                                    />
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={commentForm.processing || !commentForm.data.content.trim()}
                                        >
                                            <Send className="mr-1.5 h-3.5 w-3.5" />
                                            Submit Comment
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="rounded-lg border bg-white dark:bg-neutral-900 p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-3">
                                Join the discussion by signing in with your account.
                            </p>
                            <Button size="sm" asChild>
                                <Link href="/login">Log in to Comment</Link>
                            </Button>
                        </div>
                    )}

                    {/* Comments List */}
                    {post.comments.length === 0 ? (
                        <div className="text-center py-10 bg-white dark:bg-neutral-900 rounded-lg border text-sm text-muted-foreground">
                            No comments yet. Be the first to share your thoughts!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {post.comments.map((comment) => {
                                const canDelete =
                                    auth?.user?.id === comment.user_id ||
                                    auth?.user?.id === post.user_id;

                                return (
                                    <div
                                        key={comment.id}
                                        className="bg-white dark:bg-neutral-900 rounded-lg border p-4 sm:p-5 shadow-2xs space-y-2"
                                    >
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-[10px]">
                                                    <UserIcon className="h-3 w-3" />
                                                </div>
                                                <span className="font-semibold text-foreground">
                                                    {comment.user?.name || 'Anonymous User'}
                                                </span>
                                                <span className="text-muted-foreground">•</span>
                                                <span className="text-muted-foreground">
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {canDelete && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-sm text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap pl-8">
                                            {comment.content}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
