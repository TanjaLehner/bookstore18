
export class Rating {
    constructor (
        public id: number,
        public stars: number,
        public comment: string,
        public book_id: number,
        public user_id: number
    ) {  }
}
