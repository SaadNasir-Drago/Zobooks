"use strict";
// import { Client } from '@elastic/elasticsearch';
// import { query as pgQuery } from '../database'; // Adjust the import path as necessary  
// // import { esClient } from '../server';
// const BATCH_SIZE = 10000; // Adjust batch size as needed
// export const transferUserData = async () => {
//     try {
//     const totalRecords = await pgQuery('SELECT COUNT(*) FROM users'); // Get total record count
//     const total = parseInt(totalRecords.rows[0].count, 10);
//     for (let offset = 0; offset < total; offset += BATCH_SIZE) {
//       const res = await pgQuery(`SELECT * FROM users LIMIT ${BATCH_SIZE} OFFSET ${offset}`);
//       const data = res.rows;
//       // Log the current batch of data
//       console.log(`Processing batch from offset ${offset}:`, data.length);
//       const promises = data.map(async (row: any) => {
//         await esClient.index({
//           index: 'user_index', // Replace with your Elasticsearch index name
//           body: row,
//         });
//       });
//       await Promise.all(promises);
//       console.log(`Batch from offset ${offset} processed successfully!`);
//     }
//     console.log('All user data transferred successfully!');
//   } catch (error) {
//     console.error('Error transferring user data:', error);
//   }
// };
// export const transferBookData = async () => {
//   try {
//     const totalRecords = await pgQuery('SELECT COUNT(*) FROM books'); // Get total record count
//     const total = parseInt(totalRecords.rows[0].count, 10);
//     for (let offset = 0; offset < total; offset += BATCH_SIZE) {
//       const res = await pgQuery(`SELECT * FROM books LIMIT ${BATCH_SIZE} OFFSET ${offset}`);
//       const data = res.rows;
//       // Log the current batch of data
//       console.log(`Processing batch from offset ${offset}:`, data.length);
//       const promises = data.map(async (row: any) => {
//         await esClient.index({
//           index: 'book_index_1', // Replace with your Elasticsearch index name
//           body: row,
//         });
//       });
//       await Promise.all(promises);
//       console.log(`Batch from offset ${offset} processed successfully!`);
//     }
//     console.log('All book data transferred successfully!');
//   } catch (error) {
//     console.error('Error transferring book data:', error);
//   }
// };
// export const transferGenreData = async () => {
//   try {
//     const totalRecords = await pgQuery('SELECT COUNT(*) FROM genres'); // Get total record count
//     const total = parseInt(totalRecords.rows[0].count, 10);
//     for (let offset = 0; offset < total; offset += BATCH_SIZE) {
//       const res = await pgQuery(`SELECT * FROM genres LIMIT ${BATCH_SIZE} OFFSET ${offset}`);
//       const data = res.rows;
//       // Log the current batch of data
//       console.log(`Processing batch from offset ${offset}:`, data.length);
//       const promises = data.map(async (row: any) => {
//         await esClient.index({
//           index: 'genre_index', // Replace with your Elasticsearch index name
//           body: row,
//         });
//       });
//       await Promise.all(promises);
//       console.log(`Batch from offset ${offset} processed successfully!`);
//     }
//     console.log('All genre data transferred successfully!');
//   } catch (error) {
//     console.error('Error transferring genre data:', error);
//   }
// };
// export const transferGenreBookData = async () => {
//   try {
//     const totalRecords = await pgQuery('SELECT COUNT(*) FROM genre_books'); // Get total record count
//     const total = parseInt(totalRecords.rows[0].count, 10);
//     for (let offset = 0; offset < total; offset += BATCH_SIZE) {
//       const res = await pgQuery(`SELECT * FROM genre_books LIMIT ${BATCH_SIZE} OFFSET ${offset}`);
//       const data = res.rows;
//       // Log the current batch of data
//       console.log(`Processing batch from offset ${offset}:`, data.length);
//       const promises = data.map(async (row: any) => {
//         await esClient.index({
//           index: 'genre_book_index', // Replace with your Elasticsearch index name
//           body: row,
//         });
//       });
//       await Promise.all(promises);
//       console.log(`Batch from offset ${offset} processed successfully!`);
//     }
//     console.log('All genre_book data transferred successfully!');
//   } catch (error) {
//     console.error('Error transferring genre_book data:', error);
//   }
// };
// export const transferLikeData = async () => {
//   try {
//     const totalRecords = await pgQuery('SELECT COUNT(*) FROM likes'); // Get total record count
//     const total = parseInt(totalRecords.rows[0].count, 10);
//     for (let offset = 0; offset < total; offset += BATCH_SIZE) {
//       const res = await pgQuery(`SELECT * FROM likes LIMIT ${BATCH_SIZE} OFFSET ${offset}`);
//       const data = res.rows;
//       // Log the current batch of data
//       console.log(`Processing batch from offset ${offset}:`, data.length);
//       const promises = data.map(async (row: any) => {
//         await esClient.index({
//           index: 'like_index', // Replace with your Elasticsearch index name
//           body: row,
//         });
//       });
//       await Promise.all(promises);
//       console.log(`Batch from offset ${offset} processed successfully!`);
//     }
//     console.log('All like data transferred successfully!');
//   } catch (error) {
//     console.error('Error transferring like data:', error);
//   }
// };
