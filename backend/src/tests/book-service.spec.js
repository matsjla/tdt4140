import { describe, expect, it, beforeEach } from "vitest";
import { createMockDatabase } from "../sqlite.js";
import { GenreService } from "../genre-service.js";
import { AuthorService } from "../author-service.js";
import { BookService } from "../book-service.js";

describe("book service", () => {
  let database;
  let genreService;
  let authorService;
  let bookService;

  let author1;
  let author2;
  let genre1;
  let genre2;

  beforeEach(async () => {
    database = await createMockDatabase();
    genreService = new GenreService(database);
    authorService = new AuthorService(database);
    bookService = new BookService(database);

    author1 = await authorService.create({ name: "John Doe" });
    author2 = await authorService.create({ name: "Peter Pan" });
    genre1 = await genreService.create({ name: "Romance" });
    genre2 = await genreService.create({ name: "Outer Space" });
  });

  it("can create new books", async () => {
    const book = await bookService.create({
      title: "Harry Potter",
      description: "Some book about some wizardry",
      releaseYear: 2000,
      image: "google.com/image",
      genres: [genre1.id],
      authors: [author1.id, author2.id],
      goodreadsUrl: "https://www.goodreads.com/book/show/7670800-clementine",
      newspapersRating: 4.3,
      goodreadsRating: 3,
    });
    expect(book).toStrictEqual({
      id: 1,
      title: "Harry Potter",
      description: "Some book about some wizardry",
      release_year: 2000,
      image: "google.com/image",
      genres: [genre1],
      authors: [author1, author2],
      averageRating: null,
      goodreads_url: "https://www.goodreads.com/book/show/7670800-clementine",
      goodreads_rating: 3,
      ratingCount: 0,
      newspapers_rating: 4.3,
    });
  });

  it("cannot assign the same author/genre book combination twice", async () => {
    const book = await bookService.create({
      title: "Harry Potter",
      description: "Some book about some wizardry",
      releaseYear: 2000,
      image: "google.com/image",
      genres: [genre1.id],
      authors: [author1.id, author2.id],
      goodreadsUrl: "https://www.goodreads.com/book/show/7670800-clementine",
      newspapersRating: 4.3,
      goodreadsRating: 3,
    });
    await expect(() =>
      bookService.createBookOnAuthor({ bookId: book.id, authorId: author1.id }),
    ).rejects.toThrowError();
    await expect(() =>
      bookService.createBookOnGenre({ bookId: book.id, genreId: genre1.id }),
    ).rejects.toThrowError();
  });

  it("can find existing books", async () => {
    const book = await bookService.create({
      title: "Harry Potter",
      description: "Some book about some wizardry",
      releaseYear: 2000,
      image: "google.com/image",
      genres: [genre1.id],
      authors: [author1.id, author2.id],
      goodreadsUrl: "https://www.goodreads.com/book/show/7670800-clementine",
      newspapersRating: 4.3,
      goodreadsRating: 3,
    });
    const found = await bookService.find(book.id);
    expect(found.id).toEqual(book.id);
  });

  it("can find genres and authors for a given book", async () => {
    const book = await bookService.create({
      title: "Harry Potter",
      description: "Some book about some wizardry",
      releaseYear: 2000,
      image: "google.com/image",
      genres: [genre1.id],
      authors: [author1.id, author2.id],
      goodreadsUrl: "https://www.goodreads.com/book/show/7670800-clementine",
      newspapersRating: 4.3,
      goodreadsRating: 3,
    });
    const genres = await bookService.getGenres(book.id);
    expect(genres).toHaveLength(1);
    const authors = await bookService.getAuthors(book.id);
    expect(authors).toHaveLength(2);
  });

  it("can list all books", async () => {
    const empty = await bookService.list();
    expect(empty).toHaveLength(0);
    await bookService.create({
      title: "Harry Potter",
      description: "Some book about some wizardry",
      releaseYear: 2000,
      image: "google.com/image",
      genres: [genre1.id],
      authors: [author1.id, author2.id],
      goodreadsUrl: "https://www.goodreads.com/book/show/7670800-clementine",
      newspapersRating: 4.3,
      goodreadsRating: 3,
    });
    const populated = await bookService.list();
    expect(populated).toHaveLength(1);
  });

  it("should list the most recent book", async () => {
    await bookService.create({
      title: "Harry Potter",
      description: "Some book about some wizardry",
      releaseYear: 2000,
      image: "google.com/image",
      genres: [genre1.id],
      authors: [author1.id, author2.id],
      goodreadsUrl: "https://www.goodreads.com/book/show/7670800-clementine",
      newspapersRating: 4.3,
      goodreadsRating: 3,
    });
    const book = await bookService.create({
      title: "Harry Potter 2",
      description: "Some book about some wizardry",
      releaseYear: 2003,
      image: "google.com/image",
      genres: [genre1.id],
      authors: [author1.id, author2.id],
      goodreadsUrl: "https://www.goodreads.com/book/show/7670800-clementine",
      newspapersRating: 4.3,
      goodreadsRating: 3,
    });
    const newest = await bookService.getMostRecentBooks();
    expect(newest[0]).toHaveProperty("id", book.id);
  });

  // it("can fetch all ratings on books from goodreads", async () => {
  //   const book = await bookService.create({
  //     title: "Harry Potter",
  //     description: "Some book about some wizardry",
  //     releaseYear: 2000,
  //     image: "google.com/image",
  //     genres: [genre1.id],
  //     authors: [author1.id, author2.id],
  //     goodreadsUrl: "https://www.goodreads.com/book/show/7670800-clementine",
  //     newspapersRating: 4.3,
  //   });
  //   await bookService.getAllGoodreadsRatings();
  //   const updated = await bookService.find(book.id);
  //   expect(updated.goodreads_rating).toEqual(3.71);
  // });
});
