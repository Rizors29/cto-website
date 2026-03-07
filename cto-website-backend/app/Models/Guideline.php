<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Guideline extends Model
{
    use HasFactory;
    protected $table = 'guidelines';
    protected $fillable = [
        'title',
        'file_path',
        'file_type',
        'file_size',
        'updated_by',
    ];
}
