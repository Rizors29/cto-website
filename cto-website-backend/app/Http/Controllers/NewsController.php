<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\News;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
class NewsController extends Controller
{
  public function index(Request $request)
  {
    try {
      $query = News::orderBy('created_at', 'desc');

      if ($request->has('limit')) {
        $news = $query->limit($request->limit)->get();
      } else {
        $news = $query->get();
      }

      return response()->json([
        'success' => true,
        'message' => 'Daftar berita berhasil diambil.',
        'data' => $news,
      ], 200);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Gagal mengambil data berita.',
        'error_detail' => $e->getMessage()
      ], 500);
    }
  }
  public function update($slug, Request $request)
  {
    $news = News::where('slug', $slug)->first();

    if (!$news) {
      return response()->json([
        'success' => false,
        'message' => 'Berita tidak ditemukan.',
      ], 404);
    }

    $validator = Validator::make($request->all(), [
      'title' => 'required|string|max:255',
      'publisher' => 'required|string|max:255',
      'deskripsi' => 'required|string',
      'thumbnail' => 'nullable|file|mimes:jpg,jpeg,png,mp4,mov|max:10240',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'Validasi gagal',
        'errors' => $validator->errors(),
      ], 422);
    }

    $dataToUpdate = [
      'title' => $request->title,
      'publisher' => $request->publisher,
      'deskripsi' => $request->deskripsi,
    ];

    if ($request->hasFile('thumbnail')) {
      try {
        if ($news->thumbnail) {
          Storage::disk('public')->delete($news->thumbnail);
        }

        $newThumbnailPath = $request->file('thumbnail')->store('attachments/news', 'public');
        $dataToUpdate['thumbnail'] = $newThumbnailPath;
      } catch (\Exception $e) {
        return response()->json([
          'success' => false,
          'message' => 'Gagal mengunggah file thumbnail baru.',
          'error_detail' => $e->getMessage()
        ], 500);
      }
    }

    // 4. Perbarui data berita
    try {
      $news->update($dataToUpdate);

      return response()->json([
        'success' => true,
        'message' => 'Berita berhasil diperbarui.',
        'data' => $news->fresh(), // Ambil data terbaru dari model
      ], 200);

    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Gagal menyimpan perubahan ke database.',
        'error_detail' => $e->getMessage()
      ], 500);
    }
  }
  public function store(Request $request)
  {
    $validator = Validator::make($request->all(), [
      'title' => 'required|string|max:255',
      'slug' => 'required|string',
      'deskripsi' => 'required|string',
      'publisher' => 'required|string|max:255',
      'thumbnail' => 'nullable|file|mimes:jpg,jpeg,png,mp4,mov|max:10240',
    ]);

    if ($validator->fails()) {
      return response()->json([
        'success' => false,
        'message' => 'Validasi gagal',
        'errors' => $validator->errors(),
      ], 422);
    }

    $thumbnail = null;
    if ($request->hasFile('thumbnail')) {
      try {
        $thumbnail = $request->file('thumbnail')->store('attachments/news', 'public');
      } catch (\Exception $e) {
        return response()->json([
          'success' => false,
          'message' => 'Gagal mengunggah file.',
        ], 500);
      }
    }

    try {
      $requestData = News::create([
        'title' => $request->title,
        'slug' => $request->slug,
        'deskripsi' => $request->deskripsi,
        'publisher' => $request->publisher,
        'thumbnail' => $thumbnail,
      ]);
      return response()->json([
        'success' => true,
        'message' => 'Permintaan layanan berhasil dibuat.',
        'data' => $requestData,
      ], 201);
    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Gagal menyimpan ke database.',
        'error_detail' => $e->getMessage()
      ], 500);
    }
  }

  public function show($slug)
  {
    try {
      $newsItem = News::where('slug', $slug)->first();

      if (!$newsItem) {
        return response()->json([
          'success' => false,
          'message' => 'Berita tidak ditemukan.',
        ], 404);
      }

      return response()->json([
        'success' => true,
        'message' => 'Detail berita berhasil diambil.',
        'data' => $newsItem,
      ], 200);

    } catch (\Exception $e) {
      return response()->json([
        'success' => false,
        'message' => 'Gagal mengambil detail berita karena kesalahan server.',
        'error_detail' => $e->getMessage()
      ], 500);
    }
  }

  public function incrementViews($slug)
  {
    $news = News::where('slug', $slug)->first();

    if ($news) {
      $news->increment('views');
      return response()->json(['success' => true, 'message' => 'Views incremented']);
    }

    return response()->json(['success' => false, 'message' => 'News not found'], 404);
  }

  public function destroy($slug)
  {
    $news = News::where('slug', $slug)->first();

    if (!$news) {
      return response()->json([
        'success' => false,
        'message' => 'Berita tidak ditemukan'
      ], 404);
    }

    if ($news->thumbnail && Storage::disk('public')->exists($news->thumbnail)) {
      Storage::disk('public')->delete($news->thumbnail);
    }

    $news->delete();

    return response()->json([
      'success' => true,
      'message' => 'Berita berhasil dihapus'
    ], 200);
  }
}
