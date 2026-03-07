<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
  public function register(Request $request)
  {
    $request->validate([
      'email' => 'required|email|unique:users,email|ends_with:@finnet.co.id',
      'password' => 'required|min:8|confirmed',
      'name' => 'required|string|max:255',
    ], [
      'email.ends_with' => 'Registrasi hanya diperbolehkan untuk email dengan domain @finnet.co.id.',
    ]);

    $user = User::create([
      'name' => $request->name,
      'email' => $request->email,
      'password' => Hash::make($request->password),
      'role' => 'internal',
    ]);

    return response()->json([
      'message' => 'Registrasi berhasil. Silakan login menggunakan akun Anda.',
      'user' => [
        'email' => $user->email,
        'role' => $user->role,
      ]
    ], 201);
  }

  public function login(Request $request)
  {
    $request->validate([
      'email' => 'required|email',
      'password' => 'required',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
      throw ValidationException::withMessages([
        'email' => ['Email atau password salah'],
      ]);
    }

    $user = $request->user();
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
      'message' => 'Login berhasil',
      'token' => $token,
      'user' => [
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role,
      ],
    ], 200);
  }

  public function logout(Request $request)
  {
    $request->user()->currentAccessToken()->delete();

    return response()->json([
      'message' => 'Logout berhasil'
    ], 200);
  }
}