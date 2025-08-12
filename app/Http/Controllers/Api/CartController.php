<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CartController extends Controller
{
    /**
     * Get the current user's or guest's cart.
     */
    private function getCart(Request $request)
    {
        if (Auth::check()) {
            return Cart::firstOrCreate(['user_id' => Auth::id()]);
        } else {
            $sessionId = $request->session()->getId();
            // If a guest cart doesn't exist for this session, create one
            // and link it to the current session ID.
            return Cart::firstOrCreate(['session_id' => $sessionId]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function index(Request $request)
    {
        $cart = $this->getCart($request);

        // Eager load product data for each cart item
        $cart->load('items.product');

        // Format the response to include product details directly
        $formattedItems = $cart->items->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'product_name' => $item->product->name,
                'product_price' => $item->product->price,
                'product_image' => $item->product->image,
                'total_item_price' => $item->quantity * $item->product->price,
            ];
        });

        $cartTotal = $formattedItems->sum('total_item_price');

        return response()->json([
            'cart_id' => $cart->id,
            'user_id' => $cart->user_id,
            'session_id' => $cart->session_id,
            'items' => $formattedItems,
            'cart_total' => $cartTotal,
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getCart($request);
        $product = Product::find($request->product_id);

        if (!$product) {
            return response()->json(['message' => 'Product not found.'], 404);
        }

        // Check if product is already in cart
        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            // Update quantity if item already exists
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // Add new item to cart
            $cartItem = $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json([
            'message' => 'Product added to cart successfully.',
            'cart_item' => $cartItem->load('product') // Load product for immediate response
        ]);
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0', // Allow 0 to remove item
        ]);

        // Ensure the cart item belongs to the current user's or guest's cart
        $cart = $this->getCart($request);
        if ($cartItem->cart_id !== $cart->id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        if ($request->quantity == 0) {
            $cartItem->delete();
            return response()->json(['message' => 'Product removed from cart.']);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json([
            'message' => 'Cart item updated successfully.',
            'cart_item' => $cartItem->load('product')
        ]);
    }

    /**
     * Remove a product from the cart.
     */
    public function destroy(Request $request, CartItem $cartItem)
    {
        // Ensure the cart item belongs to the current user's or guest's cart
        $cart = $this->getCart($request);
        if ($cartItem->cart_id !== $cart->id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Product removed from cart.']);
    }
}
