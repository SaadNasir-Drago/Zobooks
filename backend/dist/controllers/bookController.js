"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getGenres = exports.likeDislikeBook = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBooks = void 0;
const bookModel = __importStar(require("../models/bookModel"));
// import { esClient } from "../server";
// import { getBooks as elasticBook } from "../config/elasticSearch";
const getBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 16;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;
    const sort = req.query.sort;
    const genre = parseInt(req.query.genre);
    try {
        // const  {books, totalBooks} = await getElasticBook( limit, offset, search, sort, genre);
        // res.json({
        //   books,
        //   totalPages,
        // });
        const { books, totalBooks } = yield bookModel.getBooks(limit, offset, search, sort, genre);
        const totalPages = Math.ceil(totalBooks / limit);
        res.json({
            books,
            totalPages,
        });
    }
    catch (error) {
        res.status(500).send("Error fetching books");
    }
});
exports.getBooks = getBooks;
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFile = req.file; // Get the uploaded file from multer
        // If an image was uploaded, store its filename in bookData
        if (imageFile) {
            req.body.cover_img = imageFile.filename; // Save the image filename to bookData
        }
        yield bookModel.createBook(req.body);
        res.status(201).json({ message: "Book added successfully" });
    }
    catch (error) {
        res.status(500).send("Error adding books");
    }
});
exports.createBook = createBook;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield bookModel.updateBook(parseInt(id, 10), req.body);
        res.status(200).json({ message: "Book updated successfully" });
    }
    catch (error) {
        res.status(500).send("Error updating books");
    }
});
exports.updateBook = updateBook;
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield bookModel.deleteBook(parseInt(id, 10));
        res.status(200).send("Book deleted successfully");
    }
    catch (error) {
        res.status(500).send("Error deleting books");
    }
});
exports.deleteBook = deleteBook;
const likeDislikeBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield bookModel.likeDislikeBook(req.body);
        if (result.success) {
            // If successful, return 200 OK instead of 201 Created, 
            // as we're not always creating a new resource
            res.status(200).json({
                success: result.success,
                message: result.message
            });
        }
        else {
            // If not successful, it's not necessarily a bad request,
            // so we'll use 200 OK here as well
            res.status(200).json({
                success: result.success,
                message: result.message
            });
        }
    }
    catch (error) {
        console.error("Error in likeDislikeBook controller:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while processing your request"
        });
    }
});
exports.likeDislikeBook = likeDislikeBook;
const getGenres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genres = yield bookModel.getGenres();
        // const genres = await getElasticGenres();
        if (genres) {
            res.status(200).json(genres);
        }
        else {
            res.status(404).send("Genres not found");
        }
    }
    catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).send("Error fetching genres");
    }
});
exports.getGenres = getGenres;
