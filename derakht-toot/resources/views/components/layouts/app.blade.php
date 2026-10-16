@props([
    'title' => 'درخت توت',
    'description' => '',
    'ogImage' => null,
    'ogType' => 'website',
    'page' => '',
    'nav' => '',
    'chrome' => 'full',
    'themeColor' => '#2B0A1F',
    'bodyClass' => 'bg-cream-50 text-bark-900',
])
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="rtl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title }}</title>
    @if ($description)
        <meta name="description" content="{{ $description }}">
        <meta property="og:description" content="{{ $description }}">
    @endif
    <meta name="theme-color" content="{{ $themeColor }}">
    <meta property="og:title" content="{{ $title }}">
    <meta property="og:type" content="{{ $ogType }}">
    <meta property="og:image" content="{{ $ogImage ?? asset('images/og-default.jpg') }}">
    <link rel="canonical" href="{{ url()->current() }}">
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    @stack('head')
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>

<body data-page="{{ $page }}" data-nav="{{ $nav }}"
    @if ($chrome === 'minimal') data-chrome="minimal" @endif
    class="{{ $bodyClass }} font-body antialiased overflow-x-hidden">
    <a href="#main" class="skip-link">رفتن به محتوای اصلی</a>

    @include('partials.preloader')

    @if ($chrome === 'full')
        @include('partials.header')
    @endif

    {{ $slot }}

    @if ($chrome === 'full')
        @include('partials.footer')
    @endif

    @livewireScripts
    @stack('scripts')
</body>

</html>