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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const bookController = __importStar(require("../controllers/bookController"));
const cookieJwtAuth_1 = require("../middlewares/cookieJwtAuth");
// import * as elasticController from '../controllers/elasticController'
const localImageUpload_1 = require("../middlewares/localImageUpload");
router.get('/books', bookController.getBooks);
router.post('/addbook', localImageUpload_1.uploadSingle, cookieJwtAuth_1.cookieJwtAuth, bookController.createBook);
router.post('/likeDislike', cookieJwtAuth_1.cookieJwtAuth, bookController.likeDislikeBook);
router.get('/genres', bookController.getGenres);
router.put('/updateBook/:id', localImageUpload_1.uploadSingle, bookController.updateBook);
router.delete('/book/:id', bookController.deleteBook);
router.post('/favorite', cookieJwtAuth_1.cookieJwtAuth, bookController.favoriteBook);
exports.default = router;
