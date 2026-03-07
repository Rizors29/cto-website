<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inventory', function (Blueprint $table) {
            $table->dropColumn([
                'nik',
                'ram',
                'memory',
                'os',
                'penyedia_jasa',
                'nomor_kontrak',
                'jangka_waktu_kontrak',
                'harga_sewa',
                'keterangan',
            ]);
        });
    }

    public function down(): void
    {
        Schema::table('inventory', function (Blueprint $table) {
            $table->string('nik')->nullable();
            $table->string('ram')->nullable();
            $table->string('memory')->nullable();
            $table->string('os')->nullable();
            $table->string('penyedia_jasa')->nullable();
            $table->string('nomor_kontrak')->nullable();
            $table->string('jangka_waktu_kontrak')->nullable();
            $table->integer('harga_sewa')->nullable();
            $table->text('keterangan')->nullable();
        });
    }
};
