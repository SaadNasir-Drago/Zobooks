import { jsonBook, User } from "../types";
import { query } from "../database";

// Function to check if a string contains only ASCII characters
export const isAscii = (str: string | null): boolean => {
  if (!str) return true; // Treat null or undefined as valid
  return /^[\x00-\x7F]*$/.test(str);
};


export const cleanBooksArray = (books: jsonBook[]) => {
  return books
    .filter(book => book.coverImg !== null && book.bookId !== null && book.bookId !== undefined && book.bookId.length !== 0)   // Filter out books with null coverImg or bookId
    .map((book) => ({
      bookId: book.bookId,
      title: isAscii(book.title) && book.title?.length ? book.title?.trim() : null,
      // rating: book.rating ? parseFloat(book.rating) : null,
      pages: parseInt(book.pages) || 0,
      publish_date: book.publishDate || null,
      // numRatings: parseInt(book.numRatings) || null,
      cover_img: book.coverImg || null,
      // price: parseFloat(book.price?.trim()) || null, // Remove any extra spaces or line breaks
      author: isAscii(book.author) && book.author?.length ? book.author?.trim() : null, // Remove any extra spaces or line breaks
      description: isAscii(book.description) ? book.description?.trim() : null, // Remove any extra spaces or line breaks
      publisher: isAscii(book.publisher) ? book.publisher?.trim() : null, // Remove any extra spaces or line breaks
    }));
};

// Function to get a random user from the array
const getRandomUserId = (users: User[]): number => {
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex].user_id;
};

// Function to insert data into PostgreSQL
export const seedBooks = async (books: jsonBook[], user: User[]) => {
  const cleanBooks = cleanBooksArray(books);

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

      await query(queryText, values);
      
    } catch (error) {
      console.error(`Error inserting book with ID ${cleanedBook.bookId}:`, error);
    }
  }
  console.log("Book Data inserted successfully");
  
  // Reset the sequence to start after the seeded highest book_id
  const bookidresult = await query("SELECT MAX(book_id) FROM books");
  const maxbookid = bookidresult.rows[0].max;

  await query(`ALTER SEQUENCE likes_like_id_seq RESTART WITH ${maxbookid + 1}`);
  console.log(`Book ID sequence reset to start from ${maxbookid + 1}`);
};
