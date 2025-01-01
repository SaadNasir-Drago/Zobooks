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
exports.getUserFavorites = exports.getUserById = exports.getUserBooks = exports.createUser = void 0;
const userModel = __importStar(require("../models/userModel"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userModel.createUser(req.body);
        res.status(201).send("Registration successful");
    }
    catch (error) {
        res.status(500).send("Error adding user");
    }
});
exports.createUser = createUser;
const getUserBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = parseInt(req.body.user_id); // Ensure user_id is parsed as a number
    try {
        const books = yield userModel.getUserBooks(user_id);
        res.status(200).json(books);
    }
    catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send("Error retrieving books");
    }
});
exports.getUserBooks = getUserBooks;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = parseInt(req.body.user_id); // Ensure user_id is parsed as a number
    try {
        const user = yield userModel.getUserById(user_id);
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error retrieving user");
    }
});
exports.getUserById = getUserById;
const getUserFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_id = parseInt(req.body.user_id); // Ensure user_id is parsed as a number
    try {
        const favorites = yield userModel.getUserFavorites(user_id);
        res.status(200).json(favorites);
    }
    catch (error) {
        console.error("Error fetching favorite books:", error);
        res.status(500).send("Error retrieving favorite books");
    }
});
exports.getUserFavorites = getUserFavorites;
