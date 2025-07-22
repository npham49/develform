<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained('forms');
            $table->string('title');
            $table->string('description')->nullable();
            $table->jsonb('data');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->timestamps();
        });

        // add a foreign key to the submissions table
        Schema::table('submissions', function (Blueprint $table) {
            $table->foreignId('version_id')->nullable()->constrained('versions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('versions');
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropForeign(['version_id']);
        });
    }
};
