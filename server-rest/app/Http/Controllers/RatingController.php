<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Rating;

class RatingController extends Controller
{
    public function save(Request $request) : JsonResponse  {
        if($this->checkUser($request)){
            DB::beginTransaction();
            try {
                $rating = Rating::create($request->all());

                DB::commit();
                // return a vaild http response
                return response()->json($rating, 201);
            }
            catch (\Exception $e) {
                // rollback all queries
                DB::rollBack();
                return response()->json("saving rating failed: " . $e->getMessage(), 420);
            }
        }

        else return response()->json("saving rating failed", 420);
    }

    public function checkUser(Request $request){
        $user_id = $request['user_id'];
        $book_id = $request['book_id'];
        $userExists = DB::table('ratings')->where([
            ['user_id', '=', $user_id],
            ['book_id', '=', $book_id]
        ])->doesntExist();

        return $userExists;
    }

    public function getAllRatingsFromBook($book_id) {
        $ratings = DB::table('ratings')->where('book_id', '=', $book_id)->get();
        return $ratings;
    }
}