<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    @viteReactRefresh
    @vite(['resources/sass/app.scss', 'resources/js/app.jsx']) {{-- Corrected path to .jsx --}}
</head>

<body>
    <div id="app"></div> {{-- This is the ONLY div for React to mount into --}}


</body>

</html>