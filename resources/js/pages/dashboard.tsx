import { Head, Link, useForm } from '@inertiajs/react';
import {
    BookOpen,
    Check,
    Copy,
    ExternalLink,
    FileCode,
    FileText,
    MessageSquare,
    Pencil,
    PlusCircle,
    Send,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PostItem {
    id: number;
    title: string;
    slug: string;
    content: string;
    status: string;
    created_at: string;
    comments_count: number;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

interface ApiTokenItem {
    id: number;
    name: string;
    created_at: string;
    last_used_at: string | null;
}

interface DashboardProps {
    stats: {
        total_posts: number;
        total_comments: number;
        total_users: number;
        my_posts: number;
    };
    recentPosts: PostItem[];
    myPosts: PostItem[];
    tokens: ApiTokenItem[];
    newApiToken?: {
        name: string;
        token: string;
    };
}

export default function Dashboard({
    stats,
    recentPosts,
    myPosts,
    tokens,
    newApiToken,
}: DashboardProps) {
    const [copied, setCopied] = useState(false);
    const [editingPost, setEditingPost] = useState<PostItem | null>(null);

    // Form for creating a post
    const postForm = useForm({
        title: '',
        content: '',
        status: 'published',
    });

    // Form for editing a post
    const editForm = useForm({
        title: '',
        content: '',
        status: 'published',
    });

    // Form for generating API token
    const tokenForm = useForm({
        token_name: 'Swagger-Token',
    });

    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();
        postForm.post('/posts', {
            onSuccess: () => postForm.reset(),
        });
    };

    const openEditModal = (post: PostItem) => {
        setEditingPost(post);
        editForm.setData({
            title: post.title,
            content: post.content,
            status: post.status,
        });
        editForm.clearErrors();
    };

    const handleUpdatePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPost) {
            return;
        }

        editForm.put(`/posts/${editingPost.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingPost(null);
                editForm.reset();
            },
        });
    };

    const handleGenerateToken = (e: React.FormEvent) => {
        e.preventDefault();
        tokenForm.post('/dashboard/tokens', {
            preserveScroll: true,
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <Head title="Blog System Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-5">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Blog Management Dashboard</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage blog articles, comments, and connect to REST API with Swagger UI.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/posts">
                                <FileText className="mr-2 h-4 w-4" />
                                Browse Blog
                            </Link>
                        </Button>
                        <Button variant="default" asChild className="bg-sky-600 hover:bg-sky-700 text-white">
                            <a href="/api/documentation" target="_blank" rel="noopener">
                                <FileCode className="mr-2 h-4 w-4" />
                                Swagger UI
                                <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </Button>
                        <Button variant="secondary" asChild>
                            <a href="/docs/api" target="_blank" rel="noopener">
                                <BookOpen className="mr-2 h-4 w-4" />
                                Scramble Docs
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_posts}</div>
                            <p className="text-xs text-muted-foreground">Published articles across platform</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_comments}</div>
                            <p className="text-xs text-muted-foreground">Community discussions</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">Authors and commenters</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">My Posts</CardTitle>
                            <FileCode className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.my_posts}</div>
                            <p className="text-xs text-muted-foreground">Articles authored by you</p>
                        </CardContent>
                    </Card>
                </div>

                {/* API Token & Swagger Testing Section */}
                <Card className="border-sky-500/30 bg-gradient-to-r from-sky-500/5 via-transparent to-transparent">
                    <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileCode className="h-5 w-5 text-sky-600" />
                                    REST API & Swagger Authorization
                                </CardTitle>
                                <CardDescription>
                                    Generate a personal access token (Sanctum) to authenticate your requests in Swagger UI.
                                </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-sky-600 border-sky-300">
                                Sanctum Bearer Token
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {newApiToken && (
                            <div className="rounded-lg border border-green-300 bg-green-50 p-4 dark:bg-green-950/30 dark:border-green-800">
                                <div className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                                    New Token Generated: "{newApiToken.name}"
                                </div>
                                <p className="text-xs text-green-700 dark:text-green-400 mb-2">
                                    Copy this token now. It will not be shown again!
                                </p>
                                <div className="flex items-center gap-2">
                                    <Input
                                        readOnly
                                        value={newApiToken.token}
                                        className="font-mono text-xs bg-white dark:bg-neutral-900"
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => copyToClipboard(newApiToken.token)}
                                    >
                                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                        <span className="ml-1 text-xs">{copied ? 'Copied' : 'Copy'}</span>
                                    </Button>
                                    <Button size="sm" asChild className="bg-sky-600 hover:bg-sky-700 text-white">
                                        <a href="/api/documentation" target="_blank" rel="noopener">
                                            Open Swagger
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                            <form onSubmit={handleGenerateToken} className="flex items-center gap-2 w-full sm:w-auto">
                                <Input
                                    placeholder="Token name (e.g. Swagger Test)"
                                    value={tokenForm.data.token_name}
                                    onChange={(e) => tokenForm.setData('token_name', e.target.value)}
                                    className="max-w-xs"
                                    required
                                />
                                <Button type="submit" variant="outline" disabled={tokenForm.processing}>
                                    Generate Token
                                </Button>
                            </form>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>Active Tokens: {tokens.length}</span>
                                <span>•</span>
                                <a
                                    href="/docs/api.json"
                                    target="_blank"
                                    className="text-sky-600 hover:underline inline-flex items-center"
                                >
                                    View OpenAPI JSON <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Grid: Create Post & My Posts */}
                <div className="grid gap-6 lg:grid-cols-5">
                    {/* Create Post Form */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <PlusCircle className="h-5 w-5 text-neutral-600" />
                                Create New Post
                            </CardTitle>
                            <CardDescription>
                                Publish a new article to the blog and REST API.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreatePost} className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="title">Post Title</Label>
                                    <Input
                                        id="title"
                                        placeholder="Enter blog post title..."
                                        value={postForm.data.title}
                                        onChange={(e) => postForm.setData('title', e.target.value)}
                                        required
                                    />
                                    {postForm.errors.title && (
                                        <p className="text-xs text-red-500">{postForm.errors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="content">Content</Label>
                                    <textarea
                                        id="content"
                                        rows={5}
                                        placeholder="Write your article content here..."
                                        value={postForm.data.content}
                                        onChange={(e) => postForm.setData('content', e.target.value)}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        required
                                    />
                                    {postForm.errors.content && (
                                        <p className="text-xs text-red-500">{postForm.errors.content}</p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        value={postForm.data.status}
                                        onChange={(e) => postForm.setData('status', e.target.value)}
                                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>

                                <Button type="submit" className="w-full" disabled={postForm.processing}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Publish Article
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* My Posts & Recent Community Posts */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* My Posts Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">My Articles</CardTitle>
                                    <CardDescription>Posts authored by your account</CardDescription>
                                </div>
                                <Badge variant="secondary">{myPosts.length} posts</Badge>
                            </CardHeader>
                            <CardContent>
                                {myPosts.length === 0 ? (
                                    <div className="text-center py-8 text-sm text-muted-foreground">
                                        You haven't written any posts yet. Use the form on the left to write one!
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {myPosts.map((post) => (
                                            <div key={post.id} className="py-3 flex items-center justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <Link
                                                        href={`/posts/${post.id}`}
                                                        className="font-medium hover:underline text-sm truncate block"
                                                    >
                                                        {post.title}
                                                    </Link>
                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageSquare className="h-3 w-3" />
                                                            {post.comments_count}
                                                        </span>
                                                        <span>•</span>
                                                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="text-[10px] py-0 px-1.5 h-4">
                                                            {post.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button size="sm" variant="ghost" asChild title="View Post">
                                                        <Link href={`/posts/${post.id}`}>View</Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/20"
                                                        title="Edit Post"
                                                        onClick={() => openEditModal(post)}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                        title="Delete Post"
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this post?')) {
                                                                useForm().delete(`/posts/${post.id}`);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Community Posts */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg">Recent Community Posts</CardTitle>
                                    <CardDescription>Latest posts published across the system</CardDescription>
                                </div>
                                <Button variant="link" size="sm" asChild>
                                    <Link href="/posts">View All &rarr;</Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recentPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="p-3 rounded-lg border bg-card hover:bg-muted/40 transition-colors flex items-center justify-between"
                                        >
                                            <div className="min-w-0 flex-1 mr-3">
                                                <Link
                                                    href={`/posts/${post.id}`}
                                                    className="font-medium text-sm hover:underline block truncate"
                                                >
                                                    {post.title}
                                                </Link>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <span>By {post.user?.name || 'Author'}</span>
                                                    <span>•</span>
                                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageSquare className="h-3 w-3" />
                                                        {post.comments_count} comments
                                                    </span>
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline" asChild>
                                                <Link href={`/posts/${post.id}`}>Read</Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Edit Post Modal / Dialog */}
            <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
                <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-900 border">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <Pencil className="h-4 w-4 text-sky-600" />
                            Edit Article
                        </DialogTitle>
                        <DialogDescription>
                            Update your blog post title, content, or publication status.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdatePost} className="space-y-4 pt-2">
                        <div className="space-y-1">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                value={editForm.data.title}
                                onChange={(e) => editForm.setData('title', e.target.value)}
                                placeholder="Article title..."
                                required
                            />
                            {editForm.errors.title && (
                                <p className="text-xs text-red-500">{editForm.errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="edit-content">Content</Label>
                            <textarea
                                id="edit-content"
                                rows={6}
                                value={editForm.data.content}
                                onChange={(e) => editForm.setData('content', e.target.value)}
                                placeholder="Article content..."
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                required
                            />
                            {editForm.errors.content && (
                                <p className="text-xs text-red-500">{editForm.errors.content}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="edit-status">Status</Label>
                            <select
                                id="edit-status"
                                value={editForm.data.status}
                                onChange={(e) => editForm.setData('status', e.target.value)}
                                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                            {editForm.errors.status && (
                                <p className="text-xs text-red-500">{editForm.errors.status}</p>
                            )}
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingPost(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-sky-600 hover:bg-sky-700 text-white"
                                disabled={editForm.processing}
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
