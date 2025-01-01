"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedGenreBooks = void 0;
const database_1 = require("../database");
const likeSeed_1 = require("./likeSeed");
// Retrieve all book IDs at once
// async function getAllBookIds(): Promise<number[]> {
//   const queryText = `
//     SELECT book_id FROM books
//   `;
//   try {
//     const result = await query(queryText);
//     return result.rows.map((row) => row.book_id);
//   } catch (error) {
//     console.error("Error fetching all book IDs:", error);
//     throw error;
//   }
// }
// Retrieve all genre IDs at once
function getAllGenreIds() {
    return __awaiter(this, void 0, void 0, function* () {
        const queryText = `
    SELECT genre_id FROM genres
  `;
        try {
            const result = yield (0, database_1.query)(queryText);
            return result.rows.map((row) => row.genre_id);
        }
        catch (error) {
            console.error("Error fetching all genre IDs:", error);
            throw error;
        }
    });
}
function getRandomNumber(min, max) {
    // Ensure the min is less than or equal to max
    if (min > max) {
        throw new Error("Minimum value must be less than or equal to maximum value.");
    }
    // Generate a random number between min and max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const seedGenreBooks = (books, genres) => __awaiter(void 0, void 0, void 0, function* () {
    const booksArray = (0, likeSeed_1.cleanBooksArray)(books);
    // Check if there are valid books before proceeding
    if (booksArray.length === 0) {
        console.warn("No valid books to seed.");
        return;
    }
    // Limit to the first 500 users
    const limitedbooks = booksArray.slice(0, 200);
    for (const bookData of limitedbooks) {
        try {
            // const bookId = await getRandomBookIdFromDatabase();
            // const genreId = await getRandomGenreIdFromDatabase();
            // Skip if bookId or genreId is invalid
            // if (!bookId || !genreId) {
            //   console.warn(`Skipping invalid book or genre: bookId=${bookId}, genreId=${genreId}`);
            //   continue;
            // }
            // Check if there are valid books before proceeding
            if (booksArray.length === 0) {
                console.warn("No valid books to seed.");
                return;
            }
            // Fetch all book and genre IDs once
            // const bookIds = await getAllBookIds();
            const genreIds = yield getAllGenreIds();
            // Check if both lists are populated
            if (genreIds.length === 0) {
                console.warn("No books or genres found to seed.");
                return;
            }
            // Select a random book ID and genre ID
            //  const randomBookId = bookIds[Math.floor(Math.random() * bookIds.length)];
            const randomGenreId = genreIds[Math.floor(Math.random() * genreIds.length)];
            // const genre_id = getRandomNumber(1, genres.length);
            const book_id = getRandomNumber(1, 200);
            const queryText = `
        INSERT INTO genre_books (
          book_id, genre_id
        ) VALUES (
          $1, $2
        )
      `;
            const values = [book_id, randomGenreId];
            yield (0, database_1.query)(queryText, values);
        }
        catch (error) {
            console.error(`Error inserting genre_book for book ID ${bookData.book_id}:`, error);
        }
    }
    console.log("GenreBook data inserted successfully");
});
exports.seedGenreBooks = seedGenreBooks;
