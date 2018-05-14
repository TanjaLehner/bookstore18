<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
/* auth */
Route::group(['middleware' =>['api','cors']], function () {
    Route::post('auth/login', 'Auth\ApiAuthController@login');
});

/* methods which need authentification - JWT Token
die URL's zu den einzelnen API Methoden registrieren
*/
Route::group(['middleware' =>['jwt.auth']], function () {
    Route::post('book','BookController@save');
    Route::put('book/{isbn}', 'BookController@update');
    Route::delete('book/{isbn}', 'BookController@delete');
    Route::post('auth/logout', 'Auth\ApiAuthController@logout');
    Route::get('orders/{user_id}', 'OrderController@getAllOrdersFromUser');
    Route::post('orders/save','OrderController@save');
    Route::get('order/{order_id}', 'OrderController@getOrderById');
    Route::post('ratings/save','RatingController@save');
});

Route::get('books', 'BookController@index');
Route::get('authors', 'AuthorController@getAllAuthors');
Route::get('book/{isbn}', 'BookController@findByISBN');
Route::get('book/checkisbn/{isbn}', 'BookController@checkISBN');
Route::get('books/search/{searchTerm}', 'BookController@findBySearchTerm');
Route::get('ratings/{book_id}', 'RatingController@getAllRatingsFromBook');



