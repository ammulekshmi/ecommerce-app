<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;    // Import Order model
use App\Models\User;     // Import User model (to ensure users exist)
use App\Models\Product;  // Import Product model (to ensure products exist for order items)
use App\Models\Category; // Import Category model (if ProductSeeder calls this indirectly)

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure users, categories, and products are seeded first
        // It's crucial that UserSeeder, CategorySeeder, and ProductSeeder
        // are called BEFORE OrderSeeder in your DatabaseSeeder.
        if (User::count() === 0) {
            $this->call(UserSeeder::class);
        }
        if (Category::count() === 0) { // Safety check
            $this->call(CategorySeeder::class);
        }
        if (Product::count() === 0) { // Safety check
            $this->call(ProductSeeder::class);
        }

        // Create 10 orders, and for each order, create 1 to 5 order items
        Order::factory(10)->create()->each(function ($order) {
            // Attach 1 to 5 random products to this order as order items
            $products = Product::inRandomOrder()->take(rand(1, 5))->get();

            foreach ($products as $product) {
                $quantity = rand(1, 5);
                $order->items()->create([ // Assuming 'items' is the relationship name in Order model
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price_at_purchase' => $product->price, // Use product's current price
                ]);
            }

            // Update the total_amount for the order based on its items
            $order->update([
                'total_amount' => $order->items->sum(fn($item) => $item->quantity * $item->price_at_purchase)
            ]);
        });
    }
}
