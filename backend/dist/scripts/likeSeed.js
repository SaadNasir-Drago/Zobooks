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
exports.seedLikes = exports.cleanBooksArray = void 0;
const database_1 = require("../database");
const bookSeed_1 = require("./bookSeed");
function getRandomUserIdFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const queryText = `
    SELECT user_id FROM users
    ORDER BY RANDOM()
    LIMIT 1
  `;
        try {
            const result = yield (0, database_1.query)(queryText);
            if (result.rows.length === 0) {
                throw new Error("No users found in the database.");
            }
            return result.rows[0].user_id;
        }
        catch (error) {
            console.error("Error fetching random user_id:", error);
            throw error;
        }
    });
}
function getRandomBookIdFromDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const queryText = `
    SELECT book_id FROM books
    ORDER BY RANDOM()
    LIMIT 1
  `;
        try {
            const result = yield (0, database_1.query)(queryText);
            if (result.rows.length === 0) {
                throw new Error("No books found in the database.");
            }
            return result.rows[0].book_id;
        }
        catch (error) {
            console.error("Error fetching random book_id:", error);
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
// Function to validate and clean Like data
const cleanLikeData = (like) => {
    return {
        like_id: like.like_id, // Assuming like_id is always present and valid
        liked: typeof like.liked === "boolean" ? like.liked : false, // Ensure liked is a boolean
    };
};
const cleanBooksArray = (books) => {
    return books
        .filter((book) => book.coverImg !== null && book.bookId !== null) // Filter out books with null coverImg or book_id
        .map((book) => {
        var _a, _b, _c, _d, _e, _f, _g;
        return ({
            book_id: book.bookId,
            title: (0, bookSeed_1.isAscii)(book.title) && ((_a = book.title) === null || _a === void 0 ? void 0 : _a.length) ? (_b = book.title) === null || _b === void 0 ? void 0 : _b.trim() : null,
            rating: book.rating ? parseFloat(book.rating) : null,
            pages: parseInt(book.pages) || 0,
            publishDate: new Date(book.publishDate) || null,
            numRatings: parseInt(book.numRatings) || null,
            coverImg: book.coverImg || null,
            price: parseFloat((_c = book.price) === null || _c === void 0 ? void 0 : _c.trim()) || null, // Remove any extra spaces or line breaks
            author: (0, bookSeed_1.isAscii)(book.author) && ((_d = book.author) === null || _d === void 0 ? void 0 : _d.length)
                ? (_e = book.author) === null || _e === void 0 ? void 0 : _e.trim()
                : null, // Remove any extra spaces or line breaks
            description: (0, bookSeed_1.isAscii)(book.description) ? (_f = book.description) === null || _f === void 0 ? void 0 : _f.trim() : null, // Remove any extra spaces or line breaks
            publisher: (0, bookSeed_1.isAscii)(book.publisher) ? (_g = book.publisher) === null || _g === void 0 ? void 0 : _g.trim() : null, // Remove any extra spaces or line breaks
        });
    });
};
exports.cleanBooksArray = cleanBooksArray;
// Function to insert like data into PostgreSQL
const seedLikes = (likes, users, books) => __awaiter(void 0, void 0, void 0, function* () {
    const booksArray = (0, exports.cleanBooksArray)(books);
    for (const likeData of likes) {
        const cleanedLike = cleanLikeData(likeData);
        try {
            const queryText = `
        INSERT INTO likes (
          liked, user_id, book_id
        ) VALUES (
          $1, $2, $3
        )
        ON CONFLICT (like_id) DO NOTHING;
      `;
            const user_id = getRandomNumber(1, users.length);
            const book_id = getRandomNumber(1, 1189650);
            const values = [
                cleanedLike.liked,
                user_id,
                book_id
                // await getRandomUserIdFromDatabase(),
                // await getRandomBookIdFromDatabase()
            ];
            yield (0, database_1.query)(queryText, values);
        }
        catch (error) {
            console.error(`Error inserting like with ID ${cleanedLike.like_id}:`, error);
        }
    }
    console.log("Like data inserted successfully");
    const likeidResult = yield (0, database_1.query)("SELECT MAX(like_id) FROM likes");
    const maxlikeId = likeidResult.rows[0].max;
    yield (0, database_1.query)(`ALTER SEQUENCE likes_like_id_seq RESTART WITH ${maxlikeId + 1}`);
    console.log(`Like ID sequence reset to start from ${maxlikeId + 1}`);
});
exports.seedLikes = seedLikes;
