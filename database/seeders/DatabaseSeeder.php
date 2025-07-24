<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            CartItemSeeder::class, // Call CartItemSeeder here
            OrderSeeder::class, // Call OrderSeeder AFTER its dependencies
        ]);
    }
}
