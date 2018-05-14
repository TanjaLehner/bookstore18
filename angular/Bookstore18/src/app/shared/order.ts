import {Book} from "./book";
export {Book} from "./book";

export class Order {
    constructor (
        public id: number,
        public order_date: Date,
        public user_id: number,
        public books: Book[],
    ) {  }
}
