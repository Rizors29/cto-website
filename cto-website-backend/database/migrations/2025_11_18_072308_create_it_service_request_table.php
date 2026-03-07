<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('it_service_request', function (Blueprint $table) {
            $table->id();
            $table->string('judul_request');
            $table->text('deskripsi')->nullable();
            $table->string('jenis_kendala')->nullable();
            $table->string('username')->nullable();
            $table->string('email')->nullable();
            $table->string('status')->default('new');
            $table->string('attachment_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('it_service_request');
    }
};
