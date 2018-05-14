<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Author;


class AuthorController extends Controller
{
    /**
     * return all authors
     */
    public function getAllAuthors() {
        $authors = Author::all();
        return $authors;
    }
}
