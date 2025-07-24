<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CartItem;
use App\Models\User;
use App\Models\Product;
use App\Models\Category; // Make sure to use Category if needed for ProductSeeder

class CartItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ensure Users Exist
        if (User::count() === 0) {
            $this->call(UserSeeder::class);
        }
        $users = User::all();

        // If no users were created, there's nothing to do for cart items
        if ($users->isEmpty()) {
            echo "Skipping CartItemSeeder: No users available.\n";
            return;
        }

        // 2. Ensure Categories and Products Exist
        if (Category::count() === 0) { // Check for categories before products
            $this->call(CategorySeeder::class);
        }
        if (Product::count() === 0) {
            $this->call(ProductSeeder::class);
        }
        $products = Product::all();

        // If no products were created, cannot create cart items
        if ($products->isEmpty()) {
            echo "Skipping CartItemSeeder: No products available.\n";
            return;
        }

        // 3. Create Cart Items Ensuring Uniqueness for Each User's Cart
        $users->each(function ($user) use ($products) {
            // Determine how many unique products this user will have in their cart
            // Max 3 items, or the total number of available products if less than 3
            $numProductsToAdd = rand(1, min(3, $products->count()));

            // Select a random set of unique products for this user
            // Use shuffle() and take() to avoid issues with random() on large collections
            $selectedProducts = $products->shuffle()->take($numProductsToAdd);

            foreach ($selectedProducts as $product) {
                // Check if this user already has this product in their cart
                // (This is redundant if the unique constraint is the only protector,
                // but good for explicit logic if quantity updates are needed in a real app)
                $existingCartItem = CartItem::where('user_id', $user->id)
                    ->where('product_id', $product->id)
                    ->first();

                if (!$existingCartItem) {
                    CartItem::create([
                        'user_id' => $user->id,
                        'product_id' => $product->id,
                        'quantity' => rand(1, 3),
                    ]);
                } else {
                    // Optionally, update quantity if item already exists
                    // $existingCartItem->increment('quantity', rand(1, 3));
                }
            }
        });
    }
}
