<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;  // Import Product model
use App\Models\Category; // Import Category model (needed if factory picks random category)

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Optional: Ensure categories are seeded before products, if not handled in DatabaseSeeder order
        if (Category::count() === 0) {
            $this->call(CategorySeeder::class);
        }

        // Create 50 products using the ProductFactory
        // If you don't have a ProductFactory, create one: php artisan make:factory ProductFactory --model=Product
        Product::factory(50)->create();
    }
}
