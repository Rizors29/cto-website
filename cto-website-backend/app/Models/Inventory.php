<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;
    protected $table = 'inventory';
    protected $fillable = [
        'nama_karyawan',
        'kategori',
        'merk',
        'type',
        'serial_number',
        'tgl_mulai_sewa',
        'tgl_berakhir_sewa',
        'sisa_masa_sewa'
    ];
}
