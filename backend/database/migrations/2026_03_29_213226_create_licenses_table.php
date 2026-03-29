<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('licenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('software_id')->constrained('softwares')->cascadeOnDelete();
            $table->text('license_key'); // stocké chiffré via cast Eloquent
            $table->string('type');
            $table->unsignedInteger('seats')->default(1);
            $table->string('status')->default('active');
            $table->date('purchased_at');
            $table->date('expires_at')->nullable();
            $table->decimal('cost', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('licenses');
    }
};