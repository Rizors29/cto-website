<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class InventoryDashboardController extends Controller
{
    public function inventoryByCategory(Request $request)
    {
        $year = $request->query('year', date('Y'));

        $data = DB::table('inventory')
            ->select(
                'kategori',
                DB::raw('COUNT(*) as total')
            )
            ->whereYear('tgl_mulai_sewa', $year)
            ->groupBy('kategori')
            ->get();

        return response()->json($data);
    }

    public function inventoryPerMonth(Request $request)
    {
        $year = $request->query('year', date('Y'));

        $data = DB::table('inventory')
            ->select(
                DB::raw('MONTH(tgl_mulai_sewa) as month_number'),
                DB::raw('MONTHNAME(tgl_mulai_sewa) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->whereYear('tgl_mulai_sewa', $year)
            ->groupBy(
                DB::raw('MONTH(tgl_mulai_sewa)'),
                DB::raw('MONTHNAME(tgl_mulai_sewa)')
            )
            ->get();

        return response()->json($data);
    }
}
