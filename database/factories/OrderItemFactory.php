<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Order;   // Import Order model (optional, if setting order_id here)
use App\Models\Product; // Import Product model
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    /**
     * The name of the corresponding model.
     *
     * @var string
     */
    protected $model = OrderItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Ensure products exist before creating order items
        if (Product::count() === 0) {
            // This is a safety check; ideally, ProductSeeder runs first
            // You might need to call CategoryFactory/ProductFactory here if absolutely necessary
            \App\Models\Category::factory(3)->create(); // Create some categories
            \App\Models\Product::factory(10)->create(); // Create some products
        }

        $product = Product::inRandomOrder()->first(); // Get a random product
        $quantity = $this->faker->numberBetween(1, 5);

        return [
            // order_id will usually be set when calling this factory from the seeder context
            // 'order_id' => Order::factory(), // Or retrieve an existing Order ID
            'product_id' => $product->id,
            'quantity' => $quantity,
            'price_at_purchase' => $product->price, // Use the product's current price
        ];
    }
}
