<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Guideline;
use Illuminate\Support\Facades\Storage;

class GuidelineController extends Controller
{
    public function upload(Request $request)
{
    $request->validate([
        'file' => 'required|file|max:20480'
    ]);

    $file = $request->file('file');
    $path = $file->store('guidelines', 'public');

    $user = $request->user();

    $guideline = Guideline::create([
        'title' => $file->getClientOriginalName(),
        'file_path' => $path,
        'file_type' => $file->getClientMimeType(),
        'file_size' => $file->getSize(),
        'updated_by' => $user->name ?? $user->username ?? 'System',
    ]);

    return response()->json([
        'message' => 'File uploaded successfully',
        'data' => $guideline
    ], 201);
}

    public function list()
    {
        return Guideline::orderBy('created_at', 'desc')->get();
    }

    public function view($id)
    {
        $guideline = Guideline::findOrFail($id);

        $filePath = storage_path('app/public/' . $guideline->file_path);

        if (!file_exists($filePath)) {
            abort(404);
        }

        return response()->file($filePath);
    }

    public function destroy($id)
    {
        try {
            // Cari data guideline
            $guideline = Guideline::find($id);

            if (!$guideline) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dokumen tidak ditemukan'
                ], 404);
            }

            // Hapus file fisik jika ada
            if ($guideline->file_path && Storage::disk('public')->exists($guideline->file_path)) {
                Storage::disk('public')->delete($guideline->file_path);
            }

            // Hapus data dari database
            $guideline->delete();

            return response()->json([
                'success' => true,
                'message' => 'Dokumen berhasil dihapus'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus dokumen',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
