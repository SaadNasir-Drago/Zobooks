import express from 'express';
const cookieParser = require('cookie-parser');
import cors from 'cors';
import bookRoutes from './routes/bookRoutes';
import authRoutes from './routes/authRoute';
import userRoutes from './routes/userRoute';
import { corsOptions } from './middlewares/cors';
import bodyParser from 'body-parser';
// const { Client } = require('@elastic/elasticsearch');
import { query as pgQuery } from './database'; // Adjust the import path as necessary
// import { transferUserData, transferBookData, transferGenreData, transferLikeData, transferGenreBookData } from './scripts/elasticSearch';
// Configure the server
const server = express();
const port = 4000;

server.use(cookieParser()); // Middleware for parsing cookies
server.use(cors(corsOptions)); // CORS middleware
server.use(bodyParser.json()); // Middleware for parsing JSON
server.use(bodyParser.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
server.use('/uploads', express.static('src/uploads')); // Middleware to serve static files

// Create Elasticsearch client
// export const esClient = new Client({
//   node: 'https://localhost:9200',
//   auth: {
//     username: 'elastic', // Replace with your username
//     password: 'qEc-GaadE7RX+qNlhfQ2'  // Replace with your password
//   },
//   tls: {
//     rejectUnauthorized: false // Disable certificate validation
//   },
//   ssl: {
//     rejectUnauthorized: false // Disable certificate validation
//   }
// });

// Function to test Elasticsearch connection
// const testElasticSearchConnection = async () => {
//   try {
//     const health = await esClient.cluster.health();
//     console.log('Elasticsearch is up and running');
//     // console.log('Full Health Response:', health);
//   } catch (error) {
//     console.error('Elasticsearch connection failed:', error);
//   }
// };

// Configure the routes
server.use(authRoutes, bookRoutes, userRoutes);

// Start the server
server.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  // await testElasticSearchConnection(); // Test the Elasticsearch connectionkend
  
  // Transfer data from PostgreSQL to Elasticsearch
  // await transferBookData(); 
  // await transferUserData();
  // await transferGenreData();
  // await transferGenreBookData();
  // await transferLikeData();
});
