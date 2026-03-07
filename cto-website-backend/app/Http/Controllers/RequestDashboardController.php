<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class RequestDashboardController extends Controller
{
    public function requestSummary(Request $request)
    {
        $year = $request->query('year', date('Y'));

        $data = DB::table('it_service_request')
            ->select(
                DB::raw('COUNT(*) as total'),
                DB::raw("SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) as newStatus"),
                DB::raw("SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgress"),
                DB::raw("SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) as done"),
                DB::raw("SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected")
            )
            ->whereYear('created_at', $year)
            ->first();

        return response()->json($data);
    }

    public function myRequestSummary(Request $request)
    {
        $year = $request->query('year', date('Y'));
        $email = auth()->user()->email;

        $data = DB::table('it_service_request')
            ->select(
                DB::raw('COUNT(*) as total'),
                DB::raw("SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) as newStatus"),
                DB::raw("SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as inProgress"),
                DB::raw("SUM(CASE WHEN status = 'Done' THEN 1 ELSE 0 END) as done"),
                DB::raw("SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected")
            )
            ->where('email', $email)
            ->whereYear('created_at', $year)
            ->first();

        return response()->json($data);
    }


    public function requestByCategory(Request $request)
    {
        $year = $request->query('year', date('Y'));

        $data = DB::table('it_service_request')
            ->select(
                'jenis_kendala',
                DB::raw('COUNT(*) as total')
            )
            ->whereYear('created_at', $year)
            ->groupBy('jenis_kendala')
            ->get();

        return response()->json($data);
    }

    public function myRequestByCategory(Request $request)
    {
        $year = $request->query('year', date('Y'));
        $email = auth()->user()->email;

        $data = DB::table('it_service_request')
            ->select(
                'jenis_kendala',
                DB::raw('COUNT(*) as total')
            )
            ->where('email', $email)
            ->whereYear('created_at', $year)
            ->groupBy('jenis_kendala')
            ->orderByDesc('total')
            ->get();

        return response()->json($data);
    }

    public function requestPerMonth(Request $request)
    {
        $year = $request->query('year', date('Y'));

        $data = DB::table('it_service_request')
            ->select(
                DB::raw('MONTH(created_at) as month_number'),
                DB::raw('MONTHNAME(created_at) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->whereYear('created_at', $year)
            ->groupBy(
                DB::raw('MONTH(created_at)'),
                DB::raw('MONTHNAME(created_at)')
            )
            ->orderBy(DB::raw('MONTH(created_at)'))
            ->get();

        return response()->json($data);
    }

    public function myRequestPerMonth(Request $request)
    {
        $year = $request->query('year', date('Y'));
        $email = auth()->user()->email;

        $data = DB::table('it_service_request')
            ->select(
                DB::raw('MONTH(created_at) as month_number'),
                DB::raw('MONTHNAME(created_at) as month'),
                DB::raw('COUNT(*) as total')
            )
            ->where('email', $email)
            ->whereYear('created_at', $year)
            ->groupBy(
                DB::raw('MONTH(created_at)'),
                DB::raw('MONTHNAME(created_at)')
            )
            ->orderBy(DB::raw('MONTH(created_at)'))
            ->get();

        return response()->json($data);
    }
}
