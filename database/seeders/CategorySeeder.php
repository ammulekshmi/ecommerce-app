<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str; // Import the Str facade for slug generation

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Example with specific categories
        Category::create([
            'name' => 'Electronics',
            'slug' => Str::slug('Electronics'), // Dynamically generate slug
        ]);
        Category::create([
            'name' => 'Books',
            'slug' => Str::slug('Books'),
        ]);
        Category::create([
            'name' => 'Clothing',
            'slug' => Str::slug('Clothing'),
        ]);
        Category::create([
            'name' => 'Home & Kitchen',
            'slug' => Str::slug('Home & Kitchen'),
        ]);
        Category::create([
            'name' => 'Sports & Outdoors',
            'slug' => Str::slug('Sports & Outdoors'),
        ]);

        // If using a CategoryFactory, ensure it generates a slug:
        // Category::factory(5)->create(); // If your factory handles slug generation
    }
}
