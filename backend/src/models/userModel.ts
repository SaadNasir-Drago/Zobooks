import { query } from "../database";
import { Book, User } from "../types";

export const createUser = async (user: User): Promise<void> => {
  try {
    const result = await query(
      `
      INSERT INTO users (
            first_name, last_name, email, password
          ) VALUES (
            $1, $2, $3, $4
          )
        `,
      [user.first_name, user.last_name, user.email, user.password]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.log("database error", error);
  }
};

export const getUserById = async (
  user_id: number
): Promise<User | null | undefined> => {
  try {
    const result = await query(`SELECT * FROM users WHERE user_id = $1`, [
      user_id,
    ]);

    return result.rows[0] || null;
  } catch (error) {
    console.log("database error", error);
  }
};


export const getUserBooks = async (user_id: number): Promise<Book[] | null | undefined> => {
  try {
    const result = await query(
      `
      SELECT 
        books.*, 
        ARRAY_AGG(genres.genre_name) AS genres
      FROM books
      LEFT JOIN genre_books ON books.book_id = genre_books.book_id
      LEFT JOIN genres ON genre_books.genre_id = genres.genre_id
      WHERE books.user_id = $1
      GROUP BY books.book_id
      `,
      [user_id]
    );

    return result.rows || null;
  } catch (error) {
    console.log("database error", error);
  }
};

export const getUserFavorites = async (user_id: number): Promise<Book[] | null | undefined> => {
  try {
    const result = await query(
      `
      SELECT 
        books.*, 
        ARRAY_AGG(genres.genre_name) AS genres
      FROM books
      LEFT JOIN genre_books ON books.book_id = genre_books.book_id
      LEFT JOIN genres ON genre_books.genre_id = genres.genre_id
      INNER JOIN favorites ON books.book_id = favorites.book_id
      WHERE favorites.user_id = $1
      GROUP BY books.book_id
      `,
      [user_id]
    );
    console.log(result)

    return result.rows || null;
  } catch (error) {
    console.log("database error", error);
  }
};