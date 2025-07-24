<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str; // Import Str facade

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->word(); // Get a unique word for category name
        return [
            'name' => $name,
            'slug' => Str::slug($name), // Generate slug from the name
        ];
    }
}
