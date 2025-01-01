// import { Book, Genre } from '../types'; // Assuming you have a Book type defined
// import { esClient } from '../server';

// export const getElasticBooks = async (
//   limit: number,
//   offset: number,
//   search: string,
//   sort: string,
//   genreId: number | null
// ): Promise<{ books: Book[]; totalBooks: number }> => {
//   try {
//     if (limit <= 0 || offset < 0) {
//       throw new Error("Invalid limit or offset");
//     }

//     if (typeof search !== "string" || search.length > 255) {
//       throw new Error("Invalid search parameter");
//     }

//     if (!["trending", "recent", ""].includes(sort)) {
//       throw new Error("Invalid sort parameter");
//     }

//     // Build the base query
//     const mustQuery: any[] = [];

//     // Search filter
//     if (search) {
//       mustQuery.push({
//         multi_match: {
//           query: search,
//           fields: ['title^3', 'author', 'description'], // Boost title search
//         },
//       });
//     }

//     // Genre filter
//     if (genreId) {
//       mustQuery.push({
//         term: {
//           genre_id: genreId // Assuming genre_id is a field in your Elasticsearch index
//         }
//       });
//     }

//     // Execute the search
//     const response = await esClient.search({
//       index: 'book_index_1', // Replace with your Elasticsearch index name
//       from: offset,
//       size: limit,
//       body: {
//         query: {
//           bool: {
//             must: mustQuery,
//           },
//         },
//         sort: sort === 'trending' ? [{ likes_count: { order: 'desc' } }] : 
//               sort === 'recent' ? [{ created_at: { order: 'desc' } }] : 
//               [{ book_id: { order: 'asc' } }],
//       },
//     });
//     const totalBooks = response.hits.total.value; // Get total count of documents
//     const books: Book[] = response.hits.hits.map((hit: any) => ({
//       ...hit._source,
//       likes: hit._source.likes_count || 0,
//       dislikes: hit._source.dislikes_count || 0,
//     })); // Adjust based on your field structure

//     return { books, totalBooks };
//   } catch (error) {
//     console.error("Error in getBooks:", error);
//     throw error; // Re-throw the error for the caller to handle
//   }
// };


// export const getElasticGenres = async (): Promise<Genre[] | null> => {
//   try {
//     // Perform the search query to fetch all genres
//     const response = await esClient.search({
//       index: 'genres_index', // Replace with your actual Elasticsearch index name for genres
//       size: 1000, // Adjust the size based on the expected number of genres
//       body: {
//         query: {
//           match_all: {}, // Fetch all genres
//         },
//         sort: [
//           { genre_id: { order: 'desc' } }, // Sort by genre_id in descending order
//         ],
//       },
//     });

//     // Map the Elasticsearch response to the Genre type
//     const genres: Genre[] = response.hits.hits.map((hit: any) => ({
//       ...hit._source,
//     }));

//     return genres || null;
//   } catch (error) {
//     console.error("Error fetching genres:", error);
//     return null; // You can also throw an error if you prefer to handle it differently
//   }
// };