import { Book, jsonBook, Like, User } from "../types"; // Import the Like type
import { query } from "../database";
import { isAscii } from "./bookSeed";


async function getRandomUserIdFromDatabase(): Promise<number> {
  const queryText = `
    SELECT user_id FROM users
    ORDER BY RANDOM()
    LIMIT 1
  `;
  
  try {
    const result = await query(queryText);
    if (result.rows.length === 0) {
      throw new Error("No users found in the database.");
    }
    return result.rows[0].user_id;
  } catch (error) {
    console.error("Error fetching random user_id:", error);
    throw error;
  }
}

async function getRandomBookIdFromDatabase(): Promise<string> {
  const queryText = `
    SELECT book_id FROM books
    ORDER BY RANDOM()
    LIMIT 1
  `;
  
  try {
    const result = await query(queryText);
    if (result.rows.length === 0) {
      throw new Error("No books found in the database.");
    }
    return result.rows[0].book_id;
  } catch (error) {
    console.error("Error fetching random book_id:", error);
    throw error;
  }
}

function getRandomNumber(min: number, max: number): number {
  // Ensure the min is less than or equal to max
  if (min > max) {
      throw new Error("Minimum value must be less than or equal to maximum value.");
  }
  
  // Generate a random number between min and max
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to validate and clean Like data
const cleanLikeData = (like: Like): Like => {
  return {
    like_id: like.like_id, // Assuming like_id is always present and valid
    liked: typeof like.liked === "boolean" ? like.liked : false, // Ensure liked is a boolean
  };
};

export const cleanBooksArray = (books: jsonBook[]) => {
  return books
    .filter((book) => book.coverImg !== null && book.bookId !== null) // Filter out books with null coverImg or book_id
    .map((book) => ({
      book_id: book.bookId,
      title:
        isAscii(book.title) && book.title?.length ? book.title?.trim() : null,
      rating: book.rating ? parseFloat(book.rating) : null,
      pages: parseInt(book.pages) || 0,
      publishDate: new Date(book.publishDate) || null,
      numRatings: parseInt(book.numRatings) || null,
      coverImg: book.coverImg || null,
      price: parseFloat(book.price?.trim()) || null, // Remove any extra spaces or line breaks
      author:
        isAscii(book.author) && book.author?.length
          ? book.author?.trim()
          : null, // Remove any extra spaces or line breaks
      description: isAscii(book.description) ? book.description?.trim() : null, // Remove any extra spaces or line breaks
      publisher: isAscii(book.publisher) ? book.publisher?.trim() : null, // Remove any extra spaces or line breaks
    }));
};


// Function to insert like data into PostgreSQL
export const seedLikes = async (
  likes: Like[],
  users: User[],
  books: jsonBook[]
) => {
  const booksArray = cleanBooksArray(books);
  // Limit to the first 500 users
  const limitedlikes = likes.slice(0, 200);
  const limitedUsers = users.slice(0, 200);

  for (const likeData of limitedlikes) {
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
      
      const user_id = getRandomNumber(1, limitedUsers.length);
      const book_id = getRandomNumber(1, 200);
      const values = [
        cleanedLike.liked,
        user_id,
        book_id
        // await getRandomUserIdFromDatabase(),
        // await getRandomBookIdFromDatabase()
       
      ];

      await query(queryText, values);
    } catch (error) {
      console.error(
        `Error inserting like with ID ${cleanedLike.like_id}:`,
        error
      );
    }
  }
  console.log("Like data inserted successfully");

  const likeidResult = await query("SELECT MAX(like_id) FROM likes");
  const maxlikeId = likeidResult.rows[0].max;

  await query(`ALTER SEQUENCE likes_like_id_seq RESTART WITH ${maxlikeId + 1}`);
  console.log(`Like ID sequence reset to start from ${maxlikeId + 1}`);
};
