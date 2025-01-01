import { Pool } from "pg";
import { seedBooks } from "./scripts/bookSeed";
import { seedUsers } from "./scripts/userSeed";
import { seedGenres } from "./scripts/genreSeed";
import { seedLikes } from "./scripts/likeSeed";
import { seedGenreBooks } from "./scripts/genreBookSeed";
import { duplicateDatasetToMillionEntries } from "./scripts/oneMillion";
const bookData = require("./data/books.json");
const userData = require("./data/user.json");
const genreData = require("./data/Genre.json");
const likeData = require("./data/Like.json");

const sql = new Pool({
  user: "instabooksdb_owner",
  host: "ep-flat-hill-a6j8zxyr.us-west-2.aws.neon.tech",
  port: 5432,
  database: "instabooksdb",
  password: "nf81xPpNSrvJ",
  ssl: {
    rejectUnauthorized: false, // This is not recommended for production
  },
});

export const query = (text: string, params?: any[]) => sql.query(text, params);

const checkIfTableHasData = async (tableName: string) => {
  const result = await query(`SELECT COUNT(*) FROM ${tableName}`);
  return parseInt(result.rows[0].count, 10) > 0;
};

const createTableIfNotExists = async () => {
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
    await query(createUserTableQuery);
    await query(createBookTableQuery);
    await query(createGenreTableQuery);
    await query(createLikeTableQuery);
    await query(createGenreBookTableQuery);
    console.log("Tables created successfully or already exists");

    
     // Check and seed data
     if (!(await checkIfTableHasData('users'))) {
      await seedUsers(userData);
    }

   
    if (!(await checkIfTableHasData('books'))) {
      await seedBooks(bookData, userData);
    }

    
    if (!(await checkIfTableHasData('likes'))) {
      await seedLikes(likeData, userData, bookData);
    }

    
    if (!(await checkIfTableHasData('genres'))) {
      await seedGenres(genreData);
    }

    
    if (!(await checkIfTableHasData('genre_books'))) {
      await seedGenreBooks(bookData, genreData);
    }

    console.log("All Seed Data inserted successfully");

  } catch (error) {
    console.error("Error creating tables", error);
  }
};


createTableIfNotExists();
