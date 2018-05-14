<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Author extends Model
{
    protected $fillable = ['firstName','lastName'];

    /**
     * author belongs to many books (M:N)
     */
    public function book(): BelongsToMany {
        return $this->belongsToMany(Book::class)->withTimestamps();
    }
}
