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
exports.query = void 0;
const pg_1 = require("pg");
const bookSeed_1 = require("./scripts/bookSeed");
const userSeed_1 = require("./scripts/userSeed");
const genreSeed_1 = require("./scripts/genreSeed");
const likeSeed_1 = require("./scripts/likeSeed");
const genreBookSeed_1 = require("./scripts/genreBookSeed");
const oneMillion_1 = require("./scripts/oneMillion");
const bookData = require("./data/books.json");
const userData = require("./data/user.json");
const genreData = require("./data/Genre.json");
const likeData = require("./data/Like.json");
const sql = new pg_1.Pool({
    user: "postgres",
    host: "localhost",
    port: 5432,
    database: "postgres",
    password: "root",
});
const query = (text, params) => sql.query(text, params);
exports.query = query;
const checkIfTableHasData = (tableName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, exports.query)(`SELECT COUNT(*) FROM ${tableName}`);
    return parseInt(result.rows[0].count, 10) > 0;
});
const createTableIfNotExists = () => __awaiter(void 0, void 0, void 0, function* () {
    const createUserTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;
    const createBookTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
  book_id SERIAL PRIMARY KEY,
  bookId TEXT,
  title TEXT,
  author TEXT,
  description TEXT,
  pages INTEGER NOT NULL,
  publish_date VARCHAR(100),
  cover_img TEXT,
  publisher VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(user_id)
  ); 
  `;
    const createLikeTableQuery = `
  CREATE TABLE IF NOT EXISTS likes (
  like_id SERIAL PRIMARY KEY,
  liked BOOLEAN,
  user_id INTEGER REFERENCES users(user_id),
  book_id INTEGER REFERENCES books(book_id)
);
`;
    const createGenreTableQuery = `
CREATE TABLE IF NOT EXISTS genres (
  genre_id SERIAL PRIMARY KEY,
  genre_name VARCHAR(100) UNIQUE NOT NULL
);
`;
    const createGenreBookTableQuery = `
CREATE TABLE IF NOT EXISTS genre_books (
  id SERIAL PRIMARY KEY,
  genre_id INTEGER REFERENCES genres(genre_id),
  book_id INTEGER REFERENCES books(book_id)
);
`;
    try {
        yield (0, exports.query)(createUserTableQuery);
        yield (0, exports.query)(createBookTableQuery);
        yield (0, exports.query)(createGenreTableQuery);
        yield (0, exports.query)(createLikeTableQuery);
        yield (0, exports.query)(createGenreBookTableQuery);
        console.log("Tables created successfully or already exists");
        // Check and seed data
        if (!(yield checkIfTableHasData('users'))) {
            yield (0, userSeed_1.seedUsers)(userData);
        }
        if (!(yield checkIfTableHasData('books'))) {
            yield (0, bookSeed_1.seedBooks)((0, oneMillion_1.duplicateDatasetToMillionEntries)(bookData, 1200000), userData);
        }
        if (!(yield checkIfTableHasData('likes'))) {
            yield (0, likeSeed_1.seedLikes)(likeData, userData, bookData);
        }
        if (!(yield checkIfTableHasData('genres'))) {
            yield (0, genreSeed_1.seedGenres)(genreData);
        }
        if (!(yield checkIfTableHasData('genre_books'))) {
            yield (0, genreBookSeed_1.seedGenreBooks)(bookData, genreData);
        }
        console.log("All Seed Data inserted successfully");
    }
    catch (error) {
        console.error("Error creating tables", error);
    }
});
createTableIfNotExists();
