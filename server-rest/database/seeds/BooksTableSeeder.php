<?php

use Illuminate\Database\Seeder;

class BooksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = App\User::all()->first();

        DB::table('books')->insert([
            'title' => str_random(50),
            'isbn' => '0123456789',
            'subtitle' => str_random(80),
            'price_netto' => "10.00",
            'price_brutto' => "11.00",
            'description' => str_random(100),
            'published' => new DateTime(),
            'user_id' => $user->id,
            'created_at' => date("Y-m-d H:i:s"),
            'updated_at' => date("Y-m-d H:i:s")
        ]);

        // test authors - load them and write them to the db using Eloquent ORM
        $book = App\Book::all()->first();
        $authors = App\Author::all();

        foreach ($authors as $author) {
            $book->authors()->save($author);
        }
        $book->save();

        //add images
        DB::table('images')->insert([
            'title' => 'Laravel',
            'url' => 'https://images-eu.ssl-images-amazon.com/images/I/51CR13Djv7L._AC_US436_FMwebp_QL65_.jpg',
            'book_id' => $book->id,
            'created_at' => date("Y-m-d H:i:s"),
            'updated_at' => date("Y-m-d H:i:s")
        ]);

        DB::table('images')->insert([
            'title' => 'Angular',
            'url' => 'https://images-eu.ssl-images-amazon.com/images/I/51H--PJcVNL._AC_US436_QL65_.jpg',
            'book_id' => $book->id,
            'created_at' => date("Y-m-d H:i:s"),
            'updated_at' => date("Y-m-d H:i:s")
        ]);
    }
}
