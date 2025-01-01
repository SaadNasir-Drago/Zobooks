import { Genre } from "../types"; // Import the Genre type
import { query } from "../database";

// Function to check if a string contains only ASCII characters
const isAscii = (str: string | null): boolean => {
  if (!str) return true; // Treat null or undefined as valid
  return /^[\x00-\x7F]*$/.test(str);
};


export const cleanAndReturnGenres = (genres: Genre[]): { genre_id: number; genre_name: string }[] => {
  return genres
    .flatMap(genre => {
      if (genre.genre_name === "(no genres listed)" || genre.genre_id === 212) {
        return null; // Skip this genre
      }

      if (!isAscii(genre.genre_name) || !genre.genre_name?.length) {
        return null; // Return null for invalid genre names
      }

      // Use a Set to remove duplicates and split genre_name by '|', then trim and filter out empty strings
      const uniqueGenres = new Set(
        genre.genre_name.split('|').map(g => g.trim()).filter(g => g.length > 0)
      );

      if (uniqueGenres.size === 0) {
        return null; // Skip genres that result in empty after cleaning
      }

      // Return an array of objects with genre_id and unique genre_name
      return Array.from(uniqueGenres).map(g => ({
        genre_id: genre.genre_id,
        genre_name: g
      }));
    })
    .filter(genre => genre !== null); // Filter out null values to avoid returning an empty array
};



// Function to insert genre data into PostgreSQL
export const seedGenres = async (genres: Genre[]) => {
  // for (const genreData of genres) {
    const cleanGenres = cleanAndReturnGenres(genres); 

    for (const cleanGenre of cleanGenres) {
      try {
        const queryText = `
          INSERT INTO genres (
            genre_name
          ) VALUES (
            $1
          )
          ON CONFLICT (genre_name) DO NOTHING;
        `;

        const values = [
          cleanGenre.genre_name
        ];
        
        
        
        await query(queryText, values);
      } catch (error) {
        console.error(`Error inserting genre with name ${cleanGenre.genre_name}:`, error);
      }
    
  }
  console.log("Genre data inserted successfully");
};
