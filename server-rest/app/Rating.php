<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rating extends Model
{
    protected $fillable = ['stars','comment', 'book_id', 'user_id'];

    /**
     * rating is assigned to book (N:1)
     */
    public function book() : BelongsTo {
        return $this->belongsTo(Book::class);
    }

    /**
     * rating is assigned to user (N:1)
     */
    public function user() : BelongsTo {
        return $this->belongsTo(User::class);
    }
}
