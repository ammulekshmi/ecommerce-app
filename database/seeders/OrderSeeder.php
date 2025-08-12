<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First, ensure the UserSeeder and ProductSeeder have been run.
        // This is done in the main DatabaseSeeder, but a check here is good practice.
        if (User::count() === 0 || Product::count() === 0) {
            $this->call(UserSeeder::class);
            $this->call(ProductSeeder::class);
        }

        $users = User::all();
        $products = Product::all();

        // Create a few orders for each existing user
        foreach ($users as $user) {
            // Create a couple of orders per user for testing
            for ($i = 0; $i < random_int(1, 3); $i++) {
                $totalAmount = 0;
                $orderProducts = $products->random(random_int(1, 4));

                // Use the `create` method to directly create an order with the new shipping address
                $order = Order::create([
                    'user_id' => $user->id,
                    'total_amount' => 0, // Temporarily set to 0, we'll update it below
                    'status' => 'completed',
                    'shipping_address' => json_encode([ // Store the address as a JSON string
                        'full_name' => fake()->name(),
                        'address_line_1' => fake()->streetAddress(),
                        'address_line_2' => fake()->secondaryAddress(),
                        'city' => fake()->city(),
                        'state' => fake()->state(),
                        'zip_code' => fake()->postcode(),
                        'country' => fake()->country(),
                    ]),
                ]);

                // Create OrderItems for the newly created order
                foreach ($orderProducts as $product) {
                    $quantity = random_int(1, 5);
                    $priceAtPurchase = $product->price;

                    $order->orderItems()->create([
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'price_at_purchase' => $priceAtPurchase,
                    ]);

                    $totalAmount += $quantity * $priceAtPurchase;
                }

                // Update the total amount on the order after calculating it
                $order->update(['total_amount' => $totalAmount]);
            }
        }
    }
}
