<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\File;

class SwaggerController extends Controller
{
    /**
     * Display the Swagger UI documentation page.
     */
    public function index(): View
    {
        $spec = null;
        $apiJsonPath = base_path('api.json');

        if (File::exists($apiJsonPath)) {
            $content = File::get($apiJsonPath);
            $spec = json_decode($content, true);
        }

        return view('swagger', [
            'spec' => $spec,
        ]);
    }
}
