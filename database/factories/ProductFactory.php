<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Category; // Import Category model
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        // 🌟 SAFETY CHECK: Ensure categories exist. If not, create a default one. 🌟
        if (Category::count() === 0) {
            Category::factory()->create(); // Creates one default category if none exist
        }
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->paragraph(),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'stock_quantity' => $this->faker->numberBetween(0, 200),
            'image' => 'products/placeholder.jpg', // Example image path
            // This line links products to existing categories
            'category_id' => Category::all()->random()->id,
        ];
    }
}
