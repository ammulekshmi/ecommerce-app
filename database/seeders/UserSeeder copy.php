<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category; // Import your Category model

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create specific categories
        Category::create(['name' => 'Electronics']);
        Category::create(['name' => 'Books']);
        Category::create(['name' => 'Clothing']);
        Category::create(['name' => 'Home & Kitchen']);
        Category::create(['name' => 'Sports & Outdoors']);

        // Or if you have a CategoryFactory:
        // Category::factory(5)->create();
    }
}
