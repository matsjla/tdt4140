import { reviewSchema } from "./review.js";

export class ReviewService {
  #database;

  constructor(database) {
    this.#database = database;
  }

  async find(userId, bookId) {
    const review = await this.#database.get(
      `SELECT user_id, book_id, rating, comment, users.username AS username FROM reviews
       INNER JOIN users ON users.id = reviews.user_id
       WHERE reviews.user_id = $userId
       AND reviews.book_id = $bookId`,
      {
        $userId: userId,
        $bookId: bookId,
      },
    );
    return reviewSchema.parse({
      ...review,
    });
  }

  async list() {
    const foreignKeys = await this.#database.all(`SELECT user_id, book_id
                                                  FROM reviews`);
    return await Promise.all(
      foreignKeys.map((x) => this.find(x.user_id, x.book_id)),
    );
  }

  async create({ userId, bookId, rating, comment }) {
    const review = await this.#database.get(
      "INSERT INTO reviews (user_id, book_id, rating, comment) VALUES ($userId, $bookId, $rating, $comment) RETURNING *",
      {
        $userId: userId,
        $bookId: bookId,
        $rating: rating,
        $comment: comment,
      },
    );

    return this.find(review.user_id, review.book_id);
  }

  async delete({ userId, bookId }) {
    await this.#database.get(
      "DELETE FROM reviews WHERE book_id = $bookId AND user_id = $userId",
      {
        $bookId: bookId,
        $userId: userId,
      },
    );
  }
}
