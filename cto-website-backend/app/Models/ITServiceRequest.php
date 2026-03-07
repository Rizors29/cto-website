<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ITServiceRequest extends Model
{
    use HasFactory;
    protected $table = 'it_service_request';
    protected $fillable = [
        'judul_request',
        'deskripsi',
        'jenis_kendala',
        'username',
        'email',
        'status',
        'approved_by',
        'approved_at',
        'done_at',
        'attachment_path'
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'done_at' => 'datetime',
    ];

    public function getApprovedAtAttribute($value)
    {
        return $value ? $value : null;
    }

    public function getDoneAtAttribute($value)
    {
        return $value ? $value : null;
    }

}
