<?php
// routes/web.php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth; // Keep this if you want Laravel's auth routes

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Authentication Routes (if you want Laravel to handle some auth views)
Auth::routes();

// Catch-all route to serve the React app for all other routes
// This should be the last route definition to avoid conflicts
// In routes/web.php
Route::get('/{any}', function () {
    return view('layouts.app'); // <-- Corrected path
})->where('any', '.*');

Auth::routes();

#Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
