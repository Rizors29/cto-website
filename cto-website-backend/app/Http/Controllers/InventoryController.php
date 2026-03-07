<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventory;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->query('year');
        $query = Inventory::query();

        if ($year) {
            $query->whereYear('tgl_mulai_sewa', $year);
        }
        $items = $query
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($item) {
                if ($item->tgl_berakhir_sewa) {
                    $today = Carbon::today();
                    $end = Carbon::parse($item->tgl_berakhir_sewa);

                    if ($today > $end) {
                        $item->sisa_masa_sewa = "Expired";
                    } else {
                        $diff = $today->diff($end);

                        $years = $diff->y;
                        $months = $diff->m;
                        $days = $diff->d;
                        $item->sisa_masa_sewa = "$years Years, $months Months, $days Days";
                    }
                } else {
                    $item->sisa_masa_sewa = "-";
                }
                return $item;
            });
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_karyawan' => 'required|string|max:255',
            'kategori' => 'required|string|max:255',
            'merk' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'serial_number' => 'required|string|max:255',
            'tgl_mulai_sewa' => 'required|date',
            'tgl_berakhir_sewa' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $requestData = Inventory::create($request->only([
                'nama_karyawan',
                'kategori',
                'merk',
                'type',
                'serial_number',
                'tgl_mulai_sewa',
                'tgl_berakhir_sewa',
            ]));

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

    public function show($id)
    {
        return Inventory::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $item = Inventory::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nama_karyawan' => 'required|string|max:255',
            'kategori' => 'required|string|max:255',
            'merk' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'serial_number' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        $item->update($request->all());

        return response()->json([
            'message' => 'Inventory updated successfully',
            'data' => $item
        ], 200);
    }

    public function destroy($id)
    {
        $item = Inventory::findOrFail($id);
        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Inventory berhasil dihapus'
        ], 200);
    }
}
