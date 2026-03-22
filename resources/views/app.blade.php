<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <meta name="description" content="Real-time planning poker for agile teams">
        <link rel="canonical" href="{{ url()->current() }}">

        <meta property="og:type" content="website">
        <meta property="og:title" content="{{ config('app.name') }}">
        <meta property="og:description" content="Real-time planning poker tool">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="/og-image.png">

        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ config('app.name') }}">
        <meta name="twitter:description" content="Real-time planning poker tool">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&family=inter:400,500,600,700&display=swap" rel="stylesheet" />

        <script>
            (() => {
                try {
                    const storedTheme = localStorage.getItem('pointdeck-theme');
                    const validThemes = ['light', 'dark'];
                    document.documentElement.dataset.theme = validThemes.includes(storedTheme)
                        ? storedTheme
                        : 'light';

                    const storedFont = localStorage.getItem('font');
                    const validFonts = ['mono', 'sans', 'serif', 'system'];
                    document.documentElement.dataset.font = validFonts.includes(storedFont)
                        ? storedFont
                        : 'sans';

                    const storedContrast = localStorage.getItem('contrast');
                    const validContrasts = ['normal', 'high'];
                    document.documentElement.dataset.contrast = validContrasts.includes(storedContrast)
                        ? storedContrast
                        : 'normal';

                    const storedSize = localStorage.getItem('size');
                    const validSizes = ['normal', 'large'];
                    document.documentElement.dataset.size = validSizes.includes(storedSize)
                        ? storedSize
                        : 'normal';
                } catch (error) {
                    document.documentElement.dataset.theme = 'light';
                    document.documentElement.dataset.font = 'sans';
                    document.documentElement.dataset.contrast = 'normal';
                    document.documentElement.dataset.size = 'normal';
                }
            })();
        </script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-base antialiased">
        @inertia
    </body>
</html>
