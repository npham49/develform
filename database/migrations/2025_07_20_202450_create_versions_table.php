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
            $table->integer('version_number')->default(0);
            $table->string('title');
            $table->string('description')->nullable();
            $table->jsonb('data');
            $table->jsonb('differences')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');
            $table->timestamps();
        });

        // add a foreign key to the submissions table
        // version_id links to the version that is the live one
        Schema::table('submissions', function (Blueprint $table) {
            $table->foreignId('version_id')->nullable()->constrained('versions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // First drop the foreign key constraint from submissions table
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropForeign(['version_id']);
            $table->dropColumn('version_id');
        });

        // Then drop the versions table
        Schema::dropIfExists('versions');
    }
};
