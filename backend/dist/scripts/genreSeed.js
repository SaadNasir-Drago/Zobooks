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
exports.seedGenres = exports.cleanAndReturnGenres = void 0;
const database_1 = require("../database");
// Function to check if a string contains only ASCII characters
const isAscii = (str) => {
    if (!str)
        return true; // Treat null or undefined as valid
    return /^[\x00-\x7F]*$/.test(str);
};
const cleanAndReturnGenres = (genres) => {
    return genres
        .flatMap(genre => {
        var _a;
        if (genre.genre_name === "(no genres listed)" || genre.genre_id === 212) {
            return null; // Skip this genre
        }
        if (!isAscii(genre.genre_name) || !((_a = genre.genre_name) === null || _a === void 0 ? void 0 : _a.length)) {
            return null; // Return null for invalid genre names
        }
        // Use a Set to remove duplicates and split genre_name by '|', then trim and filter out empty strings
        const uniqueGenres = new Set(genre.genre_name.split('|').map(g => g.trim()).filter(g => g.length > 0));
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
exports.cleanAndReturnGenres = cleanAndReturnGenres;
// Function to insert genre data into PostgreSQL
const seedGenres = (genres) => __awaiter(void 0, void 0, void 0, function* () {
    // for (const genreData of genres) {
    const cleanGenres = (0, exports.cleanAndReturnGenres)(genres);
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
            yield (0, database_1.query)(queryText, values);
        }
        catch (error) {
            console.error(`Error inserting genre with name ${cleanGenre.genre_name}:`, error);
        }
    }
    console.log("Genre data inserted successfully");
});
exports.seedGenres = seedGenres;
