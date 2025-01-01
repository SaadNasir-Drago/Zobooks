import { query } from "../database";
import { Book, Genre, Like } from "../types";

export const getBooks = async (
  limit: number,
  offset: number,
  search: string,
  sort: string,
  genreId: number | null
) => {
  try {
  
    if (limit <= 0 || offset < 0) {
      throw new Error("Invalid limit or offset");
    }

    if (typeof search !== "string" || search.length > 255) {
      throw new Error("Invalid search parameter");
    }

    if (!["trending", "recent", ""].includes(sort)) {
      throw new Error("Invalid sort parameter");
    }

   
    let orderByClause;
    if (sort === "trending") {
      orderByClause = "ORDER BY COALESCE(l.likes_count, 0) DESC";
    } else if (sort === "recent") {
      orderByClause =
        "ORDER BY b.created_at DESC, COALESCE(l.likes_count, 0) DESC";
    } else {
      orderByClause = "ORDER BY b.book_id"; 
    }

    const genreFilter = genreId ? "AND gb.genre_id = $4" : "";

    const queryParams = [limit, offset, `%${search}%`];
    if (genreId !== null && genreId !== 0) {
      queryParams.push(genreId);
    }

    const result = await query(
      `
      SELECT 
    b.*,
    COALESCE(l.likes_count, 0)::integer AS likes,
    COALESCE(l.dislikes_count, 0)::integer AS dislikes,
    COALESCE(f.favorites_count, 0)::integer AS "favoritesCount"
FROM (
    SELECT DISTINCT b.book_id
    FROM books b
    LEFT JOIN genre_books gb ON b.book_id = gb.book_id
    WHERE b.title ILIKE $3
    ${genreFilter}  -- e.g. AND gb.genre_id = $someGenreId
) AS unique_books
JOIN books b 
    ON b.book_id = unique_books.book_id
LEFT JOIN (
    SELECT 
      book_id, 
      SUM(CASE WHEN liked = true THEN 1 ELSE 0 END) AS likes_count,
      SUM(CASE WHEN liked = false THEN 1 ELSE 0 END) AS dislikes_count
    FROM likes
    GROUP BY book_id
) l 
    ON b.book_id = l.book_id
LEFT JOIN (
    SELECT
      book_id,
      -- Count how many "favorited" = true
      SUM(CASE WHEN favorited = true THEN 1 ELSE 0 END) AS favorites_count
    FROM favorites
    GROUP BY book_id
) f
    ON b.book_id = f.book_id
${orderByClause}
LIMIT $1 OFFSET $2

    `,
      queryParams
    );

    
    const genreFilter2 = genreId ? "AND gb.genre_id = $2" : "";
    const countResult = await query(
      `
      SELECT COUNT(DISTINCT b.book_id) AS total_books
      FROM books b
      LEFT JOIN genre_books gb ON b.book_id = gb.book_id
      WHERE b.title ILIKE $1 ${genreFilter2}
      `,
      queryParams.slice(2) // Only pass the search and genre parameters
    );

    const totalBooks = countResult.rows[0].total_books;

    return { books: result.rows, totalBooks };
  } catch (error) {
    console.error("Error in getBooks:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

//the placeholder $1 prevents sql injection attacks
export const getBookById = async (id: number): Promise<Book | null> => {
  const result = await query("SELECT * FROM books WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const createBook = async (book: any): Promise<void> => {
  try {
    const queryText1 = `
    INSERT INTO books (
      title, pages, publish_date,  cover_img, author, description, publisher, user_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    ON CONFLICT (book_id) DO NOTHING;
  `;

    const values1 = [
      book.title,
      book.pages,
      book.publishDate,
      book.cover_img,
      book.author,
      book.description,
      book.publisher,
      book.user_id,
    ];

    await query(queryText1, values1);

    // Parse genres if they are coming in as a JSON string
    let parsedGenres = typeof book.genres === 'string' ? JSON.parse(book.genres) : book.genres;
    
    for (let genre_name of parsedGenres) {

      const book_id_result = await query(
        `SELECT book_id from books ORDER BY book_id DESC LIMIT 1`
      );
      
      const genre_id_result = await query(
        `SELECT genre_id from genres WHERE genre_name = '${genre_name}'`
      );
      
      const queryText2 = `
      INSERT INTO genre_books (
        book_id, genre_id
      ) VALUES (
        $1, $2
      )
    `;
      const values2 = [
        book_id_result.rows[0].book_id,
        genre_id_result.rows[0].genre_id,
      ];
      await query(queryText2, values2);
    }
  } catch (error) {
    console.log("Database error", error);
  }
};


export const updateBook = async (book_id: number, book: Partial<Book>): Promise<void> => {
  try {

    // Update the main book details in the books table
    const queryText1 = `
      UPDATE books 
      SET title = $1, pages = $2, publish_date = $3, cover_img = $4, author = $5, description = $6, publisher = $7
      WHERE book_id = $8
    `;

    const values1 = [
      book.title,
      book.pages,
      book.publish_date,
      book.cover_img,
      book.author,
      book.description,
      book.publisher,
      book_id,
    ];

    await query(queryText1, values1);

    // Handle genre updates by clearing old entries and inserting new ones
    if (book.genres) {
      // Parse genres if they are coming in as a JSON string
      let parsedGenres = typeof book.genres === 'string' ? JSON.parse(book.genres) : book.genres;

      // First, delete all existing genre associations for the book
      await query(`DELETE FROM genre_books WHERE book_id = $1`, [book_id]);

      // Insert the updated genres
      for (let genre_name of parsedGenres) {
        const genre_id_result = await query(
          `SELECT genre_id FROM genres WHERE genre_name = $1`, [genre_name]
        );

        if (genre_id_result.rows.length > 0) {
          const genre_id = genre_id_result.rows[0].genre_id;
          const queryText2 = `
            INSERT INTO genre_books (book_id, genre_id) 
            VALUES ($1, $2)
          `;
          await query(queryText2, [book_id, genre_id]);
        } else {
          console.error(`Genre not found: ${genre_name}`);
        }
      }
    }

  } catch (error) {
    console.error("Error updating book:", error);
    throw error; // Re-throw the error for the caller to handle
  }
};

export const deleteBook = async (book_id: number): Promise<void> => {
  try {
    await query("DELETE FROM likes WHERE book_id = $1", [book_id]);
    await query("DELETE FROM genre_books WHERE book_id = $1", [book_id]);
    await query("DELETE FROM books WHERE book_id = $1", [book_id]);
  } catch (error) {
    console.log(error)
  }
 
};


export const getGenres = async (): Promise<Genre[] | null> => {
  try {
    const result = await query("SELECT * FROM genres ORDER BY genre_id DESC");
    return result.rows || null;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return null; // or throw an error if you prefer
  }
};


export const likeDislikeBook = async (
  likeDislike: Like
): Promise<{ success: boolean; message?: string }> => {
  try {
    // First, check the current state in the database
    const currentState = await query(
      `SELECT liked FROM likes WHERE user_id = $1 AND book_id = $2`,
      [likeDislike.user_id, likeDislike.book_id]
    );

    let updateQuery: string;
    let queryParams: any[]; // Parameters to be passed to the query
    let updateMessage: string;

    if (currentState.rows.length === 0) {
      // No existing record, insert a new one
      updateQuery = `INSERT INTO likes (user_id, book_id, liked) VALUES ($1, $2, $3)`;
      queryParams = [likeDislike.user_id, likeDislike.book_id, likeDislike.liked];
      updateMessage = likeDislike.liked ? "Book liked successfully" : "Book disliked successfully";
    } else {
      const currentLiked = currentState.rows[0].liked;

      if (likeDislike.liked) {
        // User is trying to like
        console.log("User is trying to like");
        if (currentLiked === true) {
          updateQuery = `UPDATE likes SET liked = NULL WHERE user_id = $1 AND book_id = $2`;
          updateMessage = "Like removed";
          queryParams = [likeDislike.user_id, likeDislike.book_id]; // Only 2 parameters
        } else {
          updateQuery = `UPDATE likes SET liked = TRUE WHERE user_id = $1 AND book_id = $2`;
          updateMessage = "Book liked successfully";
          queryParams = [likeDislike.user_id, likeDislike.book_id]; // Only 2 parameters
        }
      } else {
        // User is trying to dislike
        if (currentLiked === false) {
          updateQuery = `UPDATE likes SET liked = NULL WHERE user_id = $1 AND book_id = $2`;
          updateMessage = "Dislike removed";
          queryParams = [likeDislike.user_id, likeDislike.book_id]; // Only 2 parameters
        } else {
          updateQuery = `UPDATE likes SET liked = FALSE WHERE user_id = $1 AND book_id = $2`;
          updateMessage = "Book disliked successfully";
          queryParams = [likeDislike.user_id, likeDislike.book_id]; // Only 2 parameters
        }
      }
    }

    await query(updateQuery, queryParams);

    return { success: true, message: updateMessage };
  } catch (error) {
    console.error("Error in likeDislikeBook:", error);
    throw error;
  }
};

export const favoriteBook = async (
  favorite: { user_id: number; book_id: number; favorited: boolean }
): Promise<{ success: boolean; message?: string }> => {
  try {
    // First, check the current state in the database
    const currentState = await query(
      `SELECT favorited FROM favorites WHERE user_id = $1 AND book_id = $2`,
      [favorite.user_id, favorite.book_id]
    );

    let updateQuery: string;
    let queryParams: any[]; // Parameters to be passed to the query
    let updateMessage: string;

    if (currentState.rows.length === 0) {
      // No existing record, insert a new one
      updateQuery = `INSERT INTO favorites (user_id, book_id, favorited) VALUES ($1, $2, $3)`;
      queryParams = [favorite.user_id, favorite.book_id, favorite.favorited];
      updateMessage = favorite.favorited ? "Book favorited successfully" : "Book unfavorited successfully";
    } else {
      const currentFavorited = currentState.rows[0].favorited;

      if (favorite.favorited) {
        // User is trying to favorite
        if (currentFavorited === true) {
          updateQuery = `UPDATE favorites SET favorited = NULL WHERE user_id = $1 AND book_id = $2`;
          updateMessage = "Favorite removed";
          queryParams = [favorite.user_id, favorite.book_id]; // Only 2 parameters
        } else {
          updateQuery = `UPDATE favorites SET favorited = TRUE WHERE user_id = $1 AND book_id = $2`;
          updateMessage = "Book favorited successfully";
          queryParams = [favorite.user_id, favorite.book_id]; // Only 2 parameters
        }
      } else {
        // User is trying to unfavorite
        if (currentFavorited === false) {
          updateQuery = `UPDATE favorites SET favorited = NULL WHERE user_id = $1 AND book_id = $2`;
          updateMessage = "Unfavorite removed";
          queryParams = [favorite.user_id, favorite.book_id]; // Only 2 parameters
        } else {
          updateQuery = `UPDATE favorites SET favorited = FALSE WHERE user_id = $1 AND book_id = $2`;
          updateMessage = "Book unfavorited successfully";
          queryParams = [favorite.user_id, favorite.book_id]; // Only 2 parameters
        }
      }
    }

    await query(updateQuery, queryParams);

    return { success: true, message: updateMessage };
  } catch (error) {
    console.error("Error in favoriteBook:", error);
    throw error;
  }
};