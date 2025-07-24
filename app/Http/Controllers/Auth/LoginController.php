<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    // Handles API login
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            // Sanctum automatically handles session-based authentication for SPAs
            // For API token based, you'd generate a token here:
            // $token = $user->createToken('auth_token')->plainTextToken;
            return response()->json(['message' => 'Logged in successfully', 'user' => $user]);
        }

        throw ValidationException::withMessages([
            'email' => [trans('auth.failed')],
        ]);
    }

    // Handles API registration
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Optional: Log in the user immediately after registration
        // Auth::login($user);
        // $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['message' => 'Registration successful', 'user' => $user], 201);
    }

    // Handles API logout
    public function logout(Request $request)
    {
        Auth::guard('web')->logout(); // Invalidate session for web guard
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
