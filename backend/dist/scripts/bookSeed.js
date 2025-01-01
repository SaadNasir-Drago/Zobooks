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
exports.seedBooks = exports.cleanBooksArray = exports.isAscii = void 0;
const database_1 = require("../database");
// Function to check if a string contains only ASCII characters
const isAscii = (str) => {
    if (!str)
        return true; // Treat null or undefined as valid
    return /^[\x00-\x7F]*$/.test(str);
};
exports.isAscii = isAscii;
const cleanBooksArray = (books) => {
    return books
        .filter(book => book.coverImg !== null && book.bookId !== null && book.bookId !== undefined && book.bookId.length !== 0) // Filter out books with null coverImg or bookId
        .map((book) => {
        var _a, _b, _c, _d, _e, _f;
        return ({
            bookId: book.bookId,
            title: (0, exports.isAscii)(book.title) && ((_a = book.title) === null || _a === void 0 ? void 0 : _a.length) ? (_b = book.title) === null || _b === void 0 ? void 0 : _b.trim() : null,
            // rating: book.rating ? parseFloat(book.rating) : null,
            pages: parseInt(book.pages) || 0,
            publish_date: book.publishDate || null,
            // numRatings: parseInt(book.numRatings) || null,
            cover_img: book.coverImg || null,
            // price: parseFloat(book.price?.trim()) || null, // Remove any extra spaces or line breaks
            author: (0, exports.isAscii)(book.author) && ((_c = book.author) === null || _c === void 0 ? void 0 : _c.length) ? (_d = book.author) === null || _d === void 0 ? void 0 : _d.trim() : null, // Remove any extra spaces or line breaks
            description: (0, exports.isAscii)(book.description) ? (_e = book.description) === null || _e === void 0 ? void 0 : _e.trim() : null, // Remove any extra spaces or line breaks
            publisher: (0, exports.isAscii)(book.publisher) ? (_f = book.publisher) === null || _f === void 0 ? void 0 : _f.trim() : null, // Remove any extra spaces or line breaks
        });
    });
};
exports.cleanBooksArray = cleanBooksArray;
// Function to get a random user from the array
const getRandomUserId = (users) => {
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex].user_id;
};
// Function to insert data into PostgreSQL
const seedBooks = (books, user) => __awaiter(void 0, void 0, void 0, function* () {
    const cleanBooks = (0, exports.cleanBooksArray)(books);
    // Limit to the first 500 users
    const limitedbooks = cleanBooks.slice(0, 200);
    const limitedUsers = user.slice(0, 200);
    for (const cleanedBook of limitedbooks) {
        try {
            const queryText = `
        INSERT INTO books (
          bookId, title, pages, publish_date, cover_img, author, description, publisher, user_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9
        )
      `;
            const values = [
                cleanedBook.bookId,
                cleanedBook.title,
                // cleanedBook.rating,
                cleanedBook.pages,
                cleanedBook.publish_date,
                // cleanedBook.numRatings,
                cleanedBook.cover_img,
                // cleanedBook.price,
                cleanedBook.author,
                cleanedBook.description,
                cleanedBook.publisher,
                getRandomUserId(limitedUsers),
            ];
            yield (0, database_1.query)(queryText, values);
        }
        catch (error) {
            console.error(`Error inserting book with ID ${cleanedBook.bookId}:`, error);
        }
    }
    console.log("Book Data inserted successfully");
    // Reset the sequence to start after the seeded highest book_id
    const bookidresult = yield (0, database_1.query)("SELECT MAX(book_id) FROM books");
    const maxbookid = bookidresult.rows[0].max;
    yield (0, database_1.query)(`ALTER SEQUENCE likes_like_id_seq RESTART WITH ${maxbookid + 1}`);
    console.log(`Book ID sequence reset to start from ${maxbookid + 1}`);
});
exports.seedBooks = seedBooks;
