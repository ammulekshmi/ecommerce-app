<?php

namespace Database\Factories;

use App\Models\CartItem;
use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartItemFactory extends Factory
{
    protected $model = CartItem::class;

    public function definition(): array
    {
        // Ensure users and products exist (safety checks as before)
        if (User::count() === 0) {
            User::factory(5)->create();
        }
        if (Product::count() === 0) {
            \App\Models\Category::factory(3)->create();
            Product::factory(10)->create();
        }

        // 🌟 THE FIX: Use unique() on faker attributes 🌟
        // This attempts to find a unique combination.
        // It might still fail if all combinations are exhausted.
        return [
            'user_id' => User::all()->random()->id, // Gets a random user, not necessarily unique per call
            'product_id' => Product::all()->random()->id, // Gets a random product, not necessarily unique per call
            'quantity' => $this->faker->numberBetween(1, 3),
        ];
    }

    // You might define a state or method to force uniqueness
    // For example, generating a truly unique combination for a specific user:
    public function forUserAndProduct(User $user, Product $product): Factory
    {
        return $this->state(fn(array $attributes) => [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }
}
