<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent;
use Illuminate\Support\Facades\DB;
use App\Book;
use App\Image;
use App\Author;

class BookController extends Controller
{
    public function index() {
        /* load all books and relations with eager loading,
           which means "load all related objects" */
        $books = Book::with(['authors', 'images', 'user'])
            ->get();
        return $books;
    }

    /**
     * find book by given ISBN number
     */
    public function findByISBN(string $isbn) : Book {
        $book = Book::where('isbn', $isbn)
            ->with(['authors', 'images', 'user'])
            ->first();
        return $book;
    }

    /**
     * returns 200 if book extists, 404 if not
     */
    public function checkISBN(string $isbn) {
        $book = Book::where('isbn', $isbn)->first();
        return $book != null ? response()->json('book with ' . $isbn . ' exists', 200) : response()->json('book with ' . $isbn . ' does not exists', 404);
    }

    /**
     * find book by search term
     * SQL injection is prevented by default, because Eloquent
     * uses PDO parameter binding
     */
    public function findBySearchTerm(string $searchTerm) {
        $book = Book::with(['authors', 'images', 'user'])
            ->where('title', 'LIKE', '%' . $searchTerm. '%')
            ->orWhere('subtitle' , 'LIKE', '%' . $searchTerm. '%')
            ->orWhere('description' , 'LIKE', '%' . $searchTerm. '%')

            /* search term in authors name */
            ->orWhereHas('authors', function($query) use ($searchTerm) {
                $query->where('firstName', 'LIKE', '%' . $searchTerm. '%')
                    ->orWhere('lastName', 'LIKE',  '%' . $searchTerm. '%');
            })->get();
        return $book;
    }

    /**
     * create new Book
     */
    public function save(Request $request) : JsonResponse  {

        $request = $this->parseRequest($request);

        /**
         *  use a transaction for saving model including relations
         * if one query fails, complete SQL statements will be rolled back
         */
        DB::beginTransaction(); //falls man mehrere inserts macht
        try {
            $book = Book::create($request->all());

            // save images
            if (isset($request['images']) && is_array($request['images'])) {
                foreach ($request['images'] as $img) {
                    $image = new Image();
                    $image->url = $img["url"];
                    $image->title = $img["title"];
                    $book->images()->save($image); //speicher Bild in DB mit Beziehung zu Buch
                }
            }

            // save authors
            if (isset($request['authors']) && is_array($request['authors'])) {
                foreach ($request['authors'] as $auth) {
                    //holt den Autor mit der dazugehörigen Id aus der Datenbank
                    $author = Author::where('id', $auth['id'])->first();
                    $book->authors()->save($author);
                }
            }

            DB::commit();
            // return a vaild http response
            return response()->json($book, 201);
        }
        catch (\Exception $e) {
            // rollback all queries
            DB::rollBack();
            return response()->json("saving book failed: " . $e->getMessage(), 420);
        }
    }

    public function update(Request $request, string $isbn) : JsonResponse
    {

        DB::beginTransaction();
        try {
            $book = Book::with(['authors', 'images', 'user'])
                ->where('isbn', $isbn)->first();
            if ($book != null) {
                $request = $this->parseRequest($request);
                $book->update($request->all());

                //delete current images
                foreach ($book->images as $img) {
                    $img->delete();
                }

                // save images
                if (isset($request['images']) && is_array($request['images'])) {
                    //delete old images first
                    foreach ($request['images'] as $img) {
                        $image = new Image();
                        $image->url = $img["url"];
                        $image->title = $img["title"];
                        $book->images()->save($image);
                    }
                }
                //delete current authors
                foreach ($book->authors as $auth) {
                    $book->authors()->detach($auth['id']);
                    //$auth->delete();
                    //detach löscht nur Beziehung nicht Autoren
                }

                // save authors
                if (isset($request['authors']) && is_array($request['authors'])) {
                    foreach ($request['authors'] as $auth) {
                        $author = Author::where('id', $auth['id'])->first();
                        $book->authors()->save($author);
                    }
                }
            }
            DB::commit();
            // return a vaild http response
            return response()->json($book, 201);
        }
        catch (\Exception $e) {
            // rollback all queries
            DB::rollBack();
            return response()->json("updating book failed: " . $e->getMessage(), 420);
        }
    }

    /**
     * returns 200 if book deleted successfully, throws excpetion if not
     */
    public function delete(string $isbn) : JsonResponse
    {
        $book = Book::where('isbn', $isbn)->first();
        if ($book != null) {
            $book->delete();
        }
        else
            throw new \Exception("book couldn't be deleted - it does not exist");
        return response()->json('book (' . $isbn . ') successfully deleted', 200);

    }

    /**
     * modify / convert values if needed
     */
    private function parseRequest(Request $request) : Request {
        // get date and convert it - its in ISO 8601, e.g. "2018-01-01T23:00:00.000Z"
        $date = new \DateTime($request->published);
        $request['published'] = $date;
        return $request;
    }


}