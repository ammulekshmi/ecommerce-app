<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Cart;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Process the checkout and create an order.
     */
    public function store(Request $request)
    {
        // Only authenticated users can checkout
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized. Please log in to checkout.'], 401);
        }

        $request->validate([
            'shipping_address' => 'required|array',
            'shipping_address.full_name' => 'required|string|max:255',
            'shipping_address.address_line_1' => 'required|string|max:255',
            'shipping_address.address_line_2' => 'nullable|string|max:255',
            'shipping_address.city' => 'required|string|max:255',
            'shipping_address.state' => 'required|string|max:255',
            'shipping_address.zip_code' => 'required|string|max:20',
            'shipping_address.country' => 'required|string|max:255',
            'billing_address' => 'nullable|array', // If same as shipping, can be null
            // Add validation for payment details here if you had a real payment gateway
        ]);

        $user = Auth::user();
        $cart = $user->cart; // Assuming user has a 'cart' relationship defined

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty. Cannot checkout.'], 400);
        }

        DB::beginTransaction();
        try {
            // Calculate total amount from cart items
            $totalAmount = 0;
            $cart->load('items.product'); // Eager load products to get prices
            foreach ($cart->items as $item) {
                // It's crucial to use the product's price at the time of purchase
                // not just current price, for accurate order history.
                // For simplicity, we use current product price here.
                // In a real app, you'd store price_at_purchase in OrderItem.
                $totalAmount += $item->quantity * $item->product->price;

                // Optional: Decrease product stock quantity
                $product = $item->product;
                if ($product->stock_quantity < $item->quantity) {
                    DB::rollBack();
                    return response()->json(['message' => "Not enough stock for {$product->name}."], 400);
                }
                $product->stock_quantity -= $item->quantity;
                $product->save();
            }

            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'status' => 'pending_payment', // Initial status
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->billing_address ?? $request->shipping_address, // Default to shipping
            ]);

            // Move cart items to order items
            foreach ($cart->items as $cartItem) {
                $order->items()->create([
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price_at_purchase' => $cartItem->product->price, // Store price at time of order
                ]);
            }

            // Clear the cart after successful order creation
            $cart->items()->delete();
            $cart->delete(); // Optionally delete the cart itself or just clear its items

            DB::commit();

            // Placeholder for payment processing (e.g., redirect to Stripe checkout)
            // For this project, we'll just return success.
            // In a real app, you'd redirect or respond with payment intent.
            // After successful payment, you'd update order status to 'processing'.

            return response()->json([
                'message' => 'Order placed successfully!',
                'order' => $order->load('items.product'), // Load items and products for response
                'payment_required' => true, // Indicate that payment is still needed
                'payment_url' => '/payment-gateway-placeholder', // A placeholder URL
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Order placement failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display a listing of the user's orders.
     */
    public function index()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }
        $orders = Auth::user()->orders()->with('items.product')->orderByDesc('created_at')->get();

        return response()->json($orders);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        if (!Auth::check() || Auth::id() !== $order->user_id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $order->load('items.product');

        return response()->json($order);
    }
}
