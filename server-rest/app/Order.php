<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Order extends Model
{
    protected $fillable = ['order_date', 'user_id'];

    /**
     * order belongs to many books (M:N)
     */
    public function books(): BelongsToMany {
        return $this->belongsToMany(Book::class);
    }
}
