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
exports.getUserBooks = exports.getUserById = exports.createUser = void 0;
const database_1 = require("../database");
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, database_1.query)(`
      INSERT INTO users (
            first_name, last_name, email, password
          ) VALUES (
            $1, $2, $3, $4
          )
        `, [user.first_name, user.last_name, user.email, user.password]);
        return result.rows[0] || null;
    }
    catch (error) {
        console.log("database error", error);
    }
});
exports.createUser = createUser;
const getUserById = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, database_1.query)(`SELECT * FROM users WHERE user_id = $1`, [
            user_id,
        ]);
        return result.rows[0] || null;
    }
    catch (error) {
        console.log("database error", error);
    }
});
exports.getUserById = getUserById;
const getUserBooks = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, database_1.query)(`
      SELECT 
        books.*, 
        ARRAY_AGG(genres.genre_name) AS genres
      FROM books
      LEFT JOIN genre_books ON books.book_id = genre_books.book_id
      LEFT JOIN genres ON genre_books.genre_id = genres.genre_id
      WHERE books.user_id = $1
      GROUP BY books.book_id
      `, [user_id]);
        return result.rows || null;
    }
    catch (error) {
        console.log("database error", error);
    }
});
exports.getUserBooks = getUserBooks;
