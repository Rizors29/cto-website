<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('inventory', function (Blueprint $table) {
        $table->id();
        $table->string('nama_karyawan');
        $table->string('nik')->nullable();
        $table->string('kategori')->nullable();
        $table->string('merk')->nullable();
        $table->string('type')->nullable();
        $table->string('ram')->nullable();
        $table->string('memory')->nullable();
        $table->string('os')->nullable();
        $table->string('serial_number')->nullable();
        $table->string('penyedia_jasa')->nullable();
        $table->string('nomor_kontrak')->nullable();
        $table->integer('jangka_waktu_kontrak')->nullable();
        $table->date('tgl_mulai_sewa')->nullable();
        $table->date('tgl_berakhir_sewa')->nullable();
        $table->string('sisa_masa_sewa')->nullable();
        $table->decimal('harga_sewa', 15, 0)->nullable();
        $table->text('keterangan')->nullable();
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};
