<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartItemController extends Controller
{
    public function index()
    {
        $cartItems = Auth::user()->cartItems()->with('product')->get();
        return response()->json($cartItems);
    }

    public function addToCart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $userId = Auth::id();
        $productId = $request->product_id;
        $quantity = $request->quantity;

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            // Update quantity if item already in cart
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            // Add new item to cart
            $cartItem = CartItem::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        $cartItem->load('product'); // Load product details
        return response()->json($cartItem, 201);
    }

    public function updateQuantity(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $cartItem = CartItem::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->firstOrFail();

        $cartItem->update(['quantity' => $request->quantity]);

        $cartItem->load('product');
        return response()->json($cartItem);
    }

    public function removeFromCart($productId)
    {
        $cartItem = CartItem::where('user_id', Auth::id())
            ->where('product_id', $productId)
            ->firstOrFail();
        $cartItem->delete();
        return response()->json(null, 204);
    }

    // Additional: If you want to clear the entire cart
    public function clearCart()
    {
        Auth::user()->cartItems()->delete();
        return response()->json(null, 204);
    }
}
