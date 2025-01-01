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
exports.transferLikeData = exports.transferGenreBookData = exports.transferGenreData = exports.transferBookData = exports.transferUserData = void 0;
const database_1 = require("../database"); // Adjust the import path as necessary  
const server_1 = require("../server");
const BATCH_SIZE = 10000; // Adjust batch size as needed
const transferUserData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRecords = yield (0, database_1.query)('SELECT COUNT(*) FROM users'); // Get total record count
        const total = parseInt(totalRecords.rows[0].count, 10);
        for (let offset = 0; offset < total; offset += BATCH_SIZE) {
            const res = yield (0, database_1.query)(`SELECT * FROM users LIMIT ${BATCH_SIZE} OFFSET ${offset}`);
            const data = res.rows;
            // Log the current batch of data
            console.log(`Processing batch from offset ${offset}:`, data.length);
            const promises = data.map((row) => __awaiter(void 0, void 0, void 0, function* () {
                yield server_1.esClient.index({
                    index: 'user_index', // Replace with your Elasticsearch index name
                    body: row,
                });
            }));
            yield Promise.all(promises);
            console.log(`Batch from offset ${offset} processed successfully!`);
        }
        console.log('All user data transferred successfully!');
    }
    catch (error) {
        console.error('Error transferring user data:', error);
    }
});
exports.transferUserData = transferUserData;
const transferBookData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRecords = yield (0, database_1.query)('SELECT COUNT(*) FROM books'); // Get total record count
        const total = parseInt(totalRecords.rows[0].count, 10);
        for (let offset = 0; offset < total; offset += BATCH_SIZE) {
            const res = yield (0, database_1.query)(`SELECT * FROM books LIMIT ${BATCH_SIZE} OFFSET ${offset}`);
            const data = res.rows;
            // Log the current batch of data
            console.log(`Processing batch from offset ${offset}:`, data.length);
            const promises = data.map((row) => __awaiter(void 0, void 0, void 0, function* () {
                yield server_1.esClient.index({
                    index: 'book_index_1', // Replace with your Elasticsearch index name
                    body: row,
                });
            }));
            yield Promise.all(promises);
            console.log(`Batch from offset ${offset} processed successfully!`);
        }
        console.log('All book data transferred successfully!');
    }
    catch (error) {
        console.error('Error transferring book data:', error);
    }
});
exports.transferBookData = transferBookData;
const transferGenreData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRecords = yield (0, database_1.query)('SELECT COUNT(*) FROM genres'); // Get total record count
        const total = parseInt(totalRecords.rows[0].count, 10);
        for (let offset = 0; offset < total; offset += BATCH_SIZE) {
            const res = yield (0, database_1.query)(`SELECT * FROM genres LIMIT ${BATCH_SIZE} OFFSET ${offset}`);
            const data = res.rows;
            // Log the current batch of data
            console.log(`Processing batch from offset ${offset}:`, data.length);
            const promises = data.map((row) => __awaiter(void 0, void 0, void 0, function* () {
                yield server_1.esClient.index({
                    index: 'genre_index', // Replace with your Elasticsearch index name
                    body: row,
                });
            }));
            yield Promise.all(promises);
            console.log(`Batch from offset ${offset} processed successfully!`);
        }
        console.log('All genre data transferred successfully!');
    }
    catch (error) {
        console.error('Error transferring genre data:', error);
    }
});
exports.transferGenreData = transferGenreData;
const transferGenreBookData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRecords = yield (0, database_1.query)('SELECT COUNT(*) FROM genre_books'); // Get total record count
        const total = parseInt(totalRecords.rows[0].count, 10);
        for (let offset = 0; offset < total; offset += BATCH_SIZE) {
            const res = yield (0, database_1.query)(`SELECT * FROM genre_books LIMIT ${BATCH_SIZE} OFFSET ${offset}`);
            const data = res.rows;
            // Log the current batch of data
            console.log(`Processing batch from offset ${offset}:`, data.length);
            const promises = data.map((row) => __awaiter(void 0, void 0, void 0, function* () {
                yield server_1.esClient.index({
                    index: 'genre_book_index', // Replace with your Elasticsearch index name
                    body: row,
                });
            }));
            yield Promise.all(promises);
            console.log(`Batch from offset ${offset} processed successfully!`);
        }
        console.log('All genre_book data transferred successfully!');
    }
    catch (error) {
        console.error('Error transferring genre_book data:', error);
    }
});
exports.transferGenreBookData = transferGenreBookData;
const transferLikeData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRecords = yield (0, database_1.query)('SELECT COUNT(*) FROM likes'); // Get total record count
        const total = parseInt(totalRecords.rows[0].count, 10);
        for (let offset = 0; offset < total; offset += BATCH_SIZE) {
            const res = yield (0, database_1.query)(`SELECT * FROM likes LIMIT ${BATCH_SIZE} OFFSET ${offset}`);
            const data = res.rows;
            // Log the current batch of data
            console.log(`Processing batch from offset ${offset}:`, data.length);
            const promises = data.map((row) => __awaiter(void 0, void 0, void 0, function* () {
                yield server_1.esClient.index({
                    index: 'like_index', // Replace with your Elasticsearch index name
                    body: row,
                });
            }));
            yield Promise.all(promises);
            console.log(`Batch from offset ${offset} processed successfully!`);
        }
        console.log('All like data transferred successfully!');
    }
    catch (error) {
        console.error('Error transferring like data:', error);
    }
});
exports.transferLikeData = transferLikeData;
