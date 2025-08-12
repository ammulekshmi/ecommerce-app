<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_amount',
        'status',
        'shipping_address', // Added
        'billing_address',  // Added
    ];

    // Ensure these casts are correct if you're storing addresses as JSON
    protected $casts = [
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'total_amount' => 'decimal:2', // Cast to decimal for precision
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
