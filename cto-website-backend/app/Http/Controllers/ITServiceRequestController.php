<?php

namespace App\Http\Controllers;
use App\Models\ITServiceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;

class ITServiceRequestController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'attachment_file' => 'nullable|file|mimes:jpg,jpeg,png,mp4,mov|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $attachmentPath = null;
        if ($request->hasFile('attachment_file')) {
            try {
                $attachmentPath = $request->file('attachment_file')->store('attachments/it_requests', 'public');
            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Gagal mengunggah file.',
                ], 500);
            }
        }

        $username = $request->user()->name ?? $request->user()->username;
        $email = $request->user()->email;

        try {
            $requestData = ITServiceRequest::create([
                'judul_request' => $request->title,
                'deskripsi' => $request->description,
                'jenis_kendala' => $request->category,
                'username' => $username,
                'email' => $email,
                'status' => 'New',
                'attachment_path' => $attachmentPath,
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

    public function index(Request $request)
    {
        $query = ITServiceRequest::query();

        if ($request->has('year')) {
            $query->whereYear('created_at', $request->year);
        }

        return response()->json([
            'data' => $query->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string'
        ]);

        $data = ITServiceRequest::findOrFail($id);
        $data->status = $request->status;
        $data->save();

        return response()->json([
            'message' => 'Status updated successfully',
            'data' => $data
        ]);
    }

    public function approve($id)
    {
        $requestData = ItServiceRequest::findOrFail($id);

        // Update status & approved info
        $requestData->status = 'In Progress';
        $requestData->approved_by = auth()->user()->username ?? 'Admin';
        $requestData->approved_at = now();

        $requestData->save();

        return response()->json([
            'message' => 'Request berhasil di-approve',
            'data' => $requestData
        ], 200);
    }
    public function reject($id)
    {
        $requestData = ItServiceRequest::findOrFail($id);

        // Update status & approved info
        $requestData->status = 'Rejected';
        $requestData->approved_by = auth()->user()->username ?? 'Admin';
        $requestData->approved_at = now();

        $requestData->save();

        return response()->json([
            'message' => 'Request ditolak',
            'data' => $requestData
        ], 200);
    }

    public function done($id)
    {
        try {
            $requestData = ITServiceRequest::findOrFail($id);
            if ($requestData->status !== 'In Progress' && $requestData->status !== 'Approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Permintaan belum pada tahap persetujuan atau pengerjaan, tidak dapat diselesaikan.',
                ], 400);
            }

            $requestData->done_at = now();
            $requestData->status = 'Done';
            $requestData->save();

            return response()->json([
                'success' => true,
                'message' => 'Permintaan berhasil diselesaikan (Done).',
                'data' => $requestData
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Request tidak ditemukan.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyelesaikan permintaan.',
                'error_detail' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $item = ITServiceRequest::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        if ($item->attachment_path && \Storage::exists('public/' . $item->attachment_path)) {
            \Storage::delete('public/' . $item->attachment_path);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Request berhasil dihapus'
        ], 200);
    }

    public function myRequests(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => ITServiceRequest::where('email', $request->user()->email)
                ->orderBy('id', 'asc')
                ->get()
        ]);
    }
}