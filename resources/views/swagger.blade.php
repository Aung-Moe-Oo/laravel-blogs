<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog System API - Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui.css" />
    <link rel="icon" type="image/png" href="https://unpkg.com/swagger-ui-dist@5.18.2/favicon-32x32.png" sizes="32x32" />
    <style>
        html {
            box-sizing: border-box;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin: 0;
            background: #fafafa;
        }
        .topbar {
            display: none;
        }
        .custom-header {
            background-color: #0f172a;
            color: #ffffff;
            padding: 1rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .custom-header h1 {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            letter-spacing: -0.025em;
        }
        .custom-header .badge {
            background: #0284c7;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            margin-left: 8px;
            text-transform: uppercase;
            font-weight: bold;
        }
        .custom-header a {
            color: #38bdf8;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
        }
        .custom-header a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="custom-header">
        <div>
            <span>Blog System REST API</span>
            <span class="badge">OpenAPI 3.1</span>
        </div>
        <div>
            <a href="/docs/api" target="_blank" style="margin-right: 16px;">Scramble UI &rarr;</a>
            <a href="/docs/api.json" target="_blank">Raw JSON Spec</a>
        </div>
    </div>
    <div id="swagger-ui"></div>

    <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-bundle.js" charset="UTF-8"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-standalone-preset.js" charset="UTF-8"></script>
    <script>
        window.onload = function() {
            const config = {
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout",
                persistAuthorization: true
            };

            @if(!empty($spec))
                config.spec = {!! json_encode($spec, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!};
            @else
                config.url = window.location.origin + "/docs/api.json";
            @endif

            window.ui = SwaggerUIBundle(config);
        };
    </script>
</body>
</html>
