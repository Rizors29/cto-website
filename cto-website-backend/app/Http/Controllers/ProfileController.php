<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'  => 'required|string|max:255',
            'photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('photo')) {

            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }

            $path = $request->file('photo')
                ->store('avatars', 'public');

            $user->photo = $path;
        }

        $user->name  = $request->name;
        $user->save();

        return response()->json([
            'message' => 'Profile updated',
            'user' => $user,
            'photo_url' => $user->photo
                ? asset('storage/' . $user->photo)
                : null
        ]);
    }
}
