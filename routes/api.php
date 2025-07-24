<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Auth\LoginController; // For API login

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Authentication API
Route::post('/login', [LoginController::class, 'authenticate']); // We will use Laravel's default login
Route::post('/register', [LoginController::class, 'register']); // We will create this method in LoginController

// Protected API routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [LoginController::class, 'logout']);

    // Resource routes for Products, Categories, Cart, Orders
    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('cart-items', CartItemController::class);
    Route::apiResource('orders', OrderController::class);

    // Custom cart actions
    Route::post('/cart-items/add', [CartItemController::class, 'addToCart']);
    Route::post('/cart-items/remove', [CartItemController::class, 'removeFromCart']);
    Route::put('/cart-items/{product_id}', [CartItemController::class, 'updateQuantity']);
    Route::post('/checkout', [OrderController::class, 'checkout']);
});
