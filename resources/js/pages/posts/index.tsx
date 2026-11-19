import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, FileCode, FileText, LayoutDashboard, MessageSquare, Search, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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

interface PostsIndexProps {
    posts: {
        data: PostItem[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
    };
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function PostsIndex({ posts, filters, auth }: PostsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/posts', { search }, { preserveState: true, replace: true });
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
            <Head title="Blog - Community Articles" />

            {/* Navigation Bar */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="font-bold text-lg flex items-center gap-2">
                            <span className="p-1.5 bg-sky-600 rounded-lg text-white">
                                <FileText className="h-4 w-4" />
                            </span>
                            <span>Blog System</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
                            <Link href="/posts" className="text-foreground transition-colors hover:text-foreground/80">
                                Articles
                            </Link>
                            <a
                                href="/api/documentation"
                                target="_blank"
                                rel="noreferrer"
                                className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1"
                            >
                                <FileCode className="h-3.5 w-3.5" />
                                Swagger API
                            </a>
                            <a
                                href="/docs/api"
                                target="_blank"
                                rel="noreferrer"
                                className="text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1"
                            >
                                <BookOpen className="h-3.5 w-3.5" />
                                Scramble Docs
                            </a>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        {auth?.user ? (
                            <Button asChild size="sm">
                                <Link href="/dashboard">
                                    <LayoutDashboard className="mr-1.5 h-4 w-4" />
                                    Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/register">Sign up</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero / Header Section */}
            <div className="border-b bg-white dark:bg-neutral-900 py-10 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <Badge variant="outline" className="border-sky-500 text-sky-600 bg-sky-50 dark:bg-sky-950/30">
                        RESTful Blog System
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Explore Stories, Ideas & Tutorials
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
                        Powered by Laravel 13, Sanctum REST API, Swagger UI OpenAPI 3.1, and React Inertia.
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center gap-2 pt-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search articles by title or keyword..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-neutral-50 dark:bg-neutral-800"
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>
                </div>
            </div>

            {/* Articles Grid */}
            <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold tracking-tight">
                        Latest Articles ({posts.total})
                    </h2>
                    {search && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearch('');
                                router.get('/posts');
                            }}
                        >
                            Clear search
                        </Button>
                    )}
                </div>

                {posts.data.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-xl border p-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-base font-semibold">No articles found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Try searching with different keywords or check back later!
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post) => (
                            <Card key={post.id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                        <span className="flex items-center gap-1 font-medium text-foreground">
                                            <UserIcon className="h-3.5 w-3.5" />
                                            {post.user?.name || 'Author'}
                                        </span>
                                        <span>•</span>
                                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-2 hover:text-sky-600 transition-colors">
                                        <Link href={`/posts/${post.id}`}>{post.title}</Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                        {post.content}
                                    </p>
                                </CardContent>
                                <CardFooter className="border-t pt-4 flex items-center justify-between text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        {post.comments_count} comments
                                    </span>
                                    <Button variant="link" size="sm" asChild className="p-0 h-auto font-medium text-sky-600">
                                        <Link href={`/posts/${post.id}`}>Read Full &rarr;</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {posts.links && posts.links.length > 3 && (
                    <div className="flex justify-center items-center gap-1 mt-10">
                        {posts.links.map((link, idx) => (
                            <Button
                                key={idx}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
