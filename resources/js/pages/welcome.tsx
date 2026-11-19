import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Code2,
    Database,
    FileCode,
    FileText,
    LayoutDashboard,
    MessageSquare,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Welcome() {
    const { auth } = usePage().props as {
        auth?: {
            user?: {
                id: number;
                name: string;
                email: string;
            };
        };
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
            <Head title="Blog System - REST API & Documentation" />

            {/* Header Navigation */}
            <header className="sticky top-0 z-40 w-full border-b bg-white/90 dark:bg-slate-900/90 backdrop-blur">
                <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                        <span className="p-2 bg-sky-600 rounded-lg text-white">
                            <FileText className="h-5 w-5" />
                        </span>
                        <span className="font-bold text-lg tracking-tight">Blog System</span>
                        <span className="text-xs bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 font-semibold px-2 py-0.5 rounded-full ml-1">
                            REST API & Swagger
                        </span>
                    </div>

                    <nav className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/posts">Articles</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <a href="/api/documentation" target="_blank" rel="noopener" className="flex items-center gap-1">
                                <FileCode className="h-4 w-4" />
                                Swagger
                            </a>
                        </Button>

                        {auth?.user ? (
                            <Button size="sm" asChild>
                                <Link href="/dashboard">
                                    <LayoutDashboard className="h-4 w-4 mr-1.5" />
                                    Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button size="sm" asChild className="bg-sky-600 hover:bg-sky-700 text-white">
                                    <Link href="/register">Sign up</Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                        <Sparkles className="h-3.5 w-3.5" />
                        Laravel 13 • Sanctum • Swagger UI • Inertia React
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 max-w-4xl mx-auto leading-tight">
                        Complete Blog System with <span className="text-sky-600">RESTful API</span> & Swagger
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        A full-stack blog platform supporting Users, Posts, and Comments. Fully documented with interactive OpenAPI 3.1 & Swagger UI specifications.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                        <Button size="lg" asChild className="bg-sky-600 hover:bg-sky-700 text-white">
                            <Link href="/posts">
                                <FileText className="mr-2 h-5 w-5" />
                                Explore Blog Articles
                            </Link>
                        </Button>

                        <Button size="lg" variant="outline" asChild>
                            <a href="/api/documentation" target="_blank" rel="noopener">
                                <FileCode className="mr-2 h-5 w-5 text-sky-600" />
                                Open Swagger UI
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </Button>

                        {auth?.user ? (
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/dashboard">
                                    <LayoutDashboard className="mr-2 h-5 w-5" />
                                    Go to Dashboard
                                </Link>
                            </Button>
                        ) : (
                            <Button size="lg" variant="secondary" asChild>
                                <Link href="/login">
                                    Sign In to Write
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <div className="h-10 w-10 rounded-lg bg-sky-100 dark:bg-sky-950/50 flex items-center justify-center text-sky-600 mb-2">
                                    <Code2 className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-base">RESTful API</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                                Clean, standard REST endpoints for Posts, Comments, and User authentication with JSON responses.
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 mb-2">
                                    <FileCode className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-base">Swagger UI Documentation</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                                Interactive Swagger UI at <code>/api/documentation</code> with "Try it out" and Bearer Authorization.
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 mb-2">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-base">Sanctum Authentication</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                                Secure token-based API authentication with user policy controls ensuring only authors can edit/delete their content.
                            </CardContent>
                        </Card>

                        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <CardHeader>
                                <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 mb-2">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-base">Discussions & Comments</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-slate-600 dark:text-slate-400">
                                Full community commenting support on articles both through the Web UI and the REST API.
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick API Explorer Banner */}
                    <div className="mt-12 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-700 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-2xl font-bold">Ready to test the REST API?</h3>
                            <p className="text-sky-100 text-sm max-w-xl">
                                Access the Swagger documentation or inspect the OpenAPI 3.1 specification JSON directly.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Button variant="secondary" size="lg" asChild className="text-sky-900 font-semibold">
                                <a href="/api/documentation" target="_blank" rel="noopener">
                                    Swagger UI &rarr;
                                </a>
                            </Button>
                            <Button variant="outline" size="lg" asChild className="bg-transparent border-white text-white hover:bg-white/10">
                                <a href="/docs/api.json" target="_blank" rel="noopener">
                                    Raw JSON Spec
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <span>Blog System • Laravel 13, React Inertia & Swagger UI</span>
                    <div className="flex items-center gap-4">
                        <a href="/api/documentation" className="hover:underline">Swagger UI</a>
                        <a href="/docs/api" className="hover:underline">Scramble Docs</a>
                        <a href="/docs/api.json" className="hover:underline">OpenAPI JSON</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
