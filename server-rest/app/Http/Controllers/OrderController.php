<?php

namespace App\Http\Controllers;

use DateTime;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Order;
use App\Book;

class OrderController extends Controller
{
    public function getAllOrdersFromUser(int $user_id)
    {
        $orders = Order::with('books')->where('user_id', '=', $user_id)->get();
        foreach ($orders as $order) {
            $prices = DB::table('book_order')->where('order_id', $order->id)->get();
            foreach ($order->books as $book) {
                foreach ($prices as $price) {
                    if ($price->book_id === $book->id) {
                        $book->price_brutto = $price->price_brutto;
                        $book->price_netto = $price->price_netto;
                    }
                }
            }
        }
        return $orders;
    }

    public function save(Request $request) : JsonResponse
    {
        $user_id = $request[1];
        $books = $request[0];
        $date = new DateTime;
        $date->format("Y-m-d");

        DB::beginTransaction();
        try {
            $order = Order::create(array(
                'order_date' => $date,
                'user_id' => $user_id,
                'books' => $books
            ));

            // save books
            if (isset($books) && is_array($books)) {
                foreach ($books as $book) {
                    $dbbook = Book::where('id', $book['id'])->first();
                    DB::insert('insert into book_order (book_id, order_id, price_netto, price_brutto, created_at, updated_at) values (?,?,?,?,?,?)', [
                        $dbbook['id'],
                        $order['id'],
                        $dbbook['price_netto'],
                        $dbbook['price_brutto'],
                        $date,
                        $date
                    ]);
                }
            }

            DB::commit();
            return response()->json($order, 201);
        } catch (\Exception $e) {
            // rollback all queries
            DB::rollBack();
            return response()->json("failed to save order: " . $e->getMessage(), 420);
        }
    }

    public function getOrderById(int $order_id)
    {
        $order = Order::with('books.images', 'books.authors')->where('id', '=', $order_id)->first();
        $prices = DB::table('book_order')->where('order_id', $order->id)->get();
        foreach ($order->books as $book) {
            foreach ($prices as $price) {
                if ($price->book_id === $book->id) {
                    $book->price_brutto = $price->price_brutto;
                    $book->price_netto = $price->price_netto;
                }
            }
        }
        return $order;
    }
}