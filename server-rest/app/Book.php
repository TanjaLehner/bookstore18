<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = ['isbn','title','subtitle','published',
        'price_netto','price_brutto','description','user_id'];

    /**
     * book is assigned to user (N:1)
     */
    public function user() : BelongsTo {
        return $this->belongsTo(User::class);
    }

    /**
     * book has many images (1:N)
     */
    public function images() : HasMany {
        return $this->hasMany(Image::class);
    }

    /**
     * book belongs to many authors (M:N)
     */
    public function authors() : BelongsToMany {
        return $this->belongsToMany(Author::class)->withTimestamps();
    }

    /**
     * book has many ratings (1:N)
     */
    public function ratings() : HasMany {
        return $this->hasMany(Rating::class);
    }

    /**
     * book belongs to many orders (M:N)
     */
    public function orders() : BelongsToMany {
        return $this->belongsToMany(Order::class);
    }
}
