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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookieParser = require('cookie-parser');
const cors_1 = __importDefault(require("cors"));
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const cors_2 = require("./middlewares/cors");
const body_parser_1 = __importDefault(require("body-parser"));
// import { transferUserData, transferBookData, transferGenreData, transferLikeData, transferGenreBookData } from './scripts/elasticSearch';
// Configure the server
const server = (0, express_1.default)();
const port = 4000;
server.use(cookieParser()); // Middleware for parsing cookies
server.use((0, cors_1.default)(cors_2.corsOptions)); // CORS middleware
server.use(body_parser_1.default.json()); // Middleware for parsing JSON
server.use(body_parser_1.default.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
server.use('/uploads', express_1.default.static('src/uploads')); // Middleware to serve static files
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
server.use(authRoute_1.default, bookRoutes_1.default, userRoute_1.default);
// Start the server
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server running at http://localhost:${port}`);
    // await testElasticSearchConnection(); // Test the Elasticsearch connectionkend
    // Transfer data from PostgreSQL to Elasticsearch
    // await transferBookData(); 
    // await transferUserData();
    // await transferGenreData();
    // await transferGenreBookData();
    // await transferLikeData();
}));
