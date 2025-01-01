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
exports.getElasticGenres = exports.getElasticBooks = void 0;
const server_1 = require("../server");
const getElasticBooks = (limit, offset, search, sort, genreId) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Build the base query
        const mustQuery = [];
        // Search filter
        if (search) {
            mustQuery.push({
                multi_match: {
                    query: search,
                    fields: ['title^3', 'author', 'description'], // Boost title search
                },
            });
        }
        // Genre filter
        if (genreId) {
            mustQuery.push({
                term: {
                    genre_id: genreId // Assuming genre_id is a field in your Elasticsearch index
                }
            });
        }
        // Execute the search
        const response = yield server_1.esClient.search({
            index: 'book_index_1', // Replace with your Elasticsearch index name
            from: offset,
            size: limit,
            body: {
                query: {
                    bool: {
                        must: mustQuery,
                    },
                },
                sort: sort === 'trending' ? [{ likes_count: { order: 'desc' } }] :
                    sort === 'recent' ? [{ created_at: { order: 'desc' } }] :
                        [{ book_id: { order: 'asc' } }],
            },
        });
        const totalBooks = response.hits.total.value; // Get total count of documents
        const books = response.hits.hits.map((hit) => (Object.assign(Object.assign({}, hit._source), { likes: hit._source.likes_count || 0, dislikes: hit._source.dislikes_count || 0 }))); // Adjust based on your field structure
        return { books, totalBooks };
    }
    catch (error) {
        console.error("Error in getBooks:", error);
        throw error; // Re-throw the error for the caller to handle
    }
});
exports.getElasticBooks = getElasticBooks;
const getElasticGenres = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Perform the search query to fetch all genres
        const response = yield server_1.esClient.search({
            index: 'genres_index', // Replace with your actual Elasticsearch index name for genres
            size: 1000, // Adjust the size based on the expected number of genres
            body: {
                query: {
                    match_all: {}, // Fetch all genres
                },
                sort: [
                    { genre_id: { order: 'desc' } }, // Sort by genre_id in descending order
                ],
            },
        });
        // Map the Elasticsearch response to the Genre type
        const genres = response.hits.hits.map((hit) => (Object.assign({}, hit._source)));
        return genres || null;
    }
    catch (error) {
        console.error("Error fetching genres:", error);
        return null; // You can also throw an error if you prefer to handle it differently
    }
});
exports.getElasticGenres = getElasticGenres;
