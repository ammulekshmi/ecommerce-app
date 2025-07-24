<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User; // Don't forget to import User model
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    /**
     * The name of the corresponding model.
     *
     * @var string
     */
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Ensure there are users to associate orders with
        if (User::count() === 0) {
            // This is a safety check; ideally, UserSeeder runs first in DatabaseSeeder
            \App\Models\User::factory(5)->create();
        }

        return [
            'user_id' => User::inRandomOrder()->first()->id, // Assign a random existing user
            'total_amount' => $this->faker->randomFloat(2, 10, 500), // Random total amount
            'status' => $this->faker->randomElement(['pending', 'processing', 'completed', 'cancelled']),
            'shipping_address' => $this->faker->address(),
        ];
    }
}
