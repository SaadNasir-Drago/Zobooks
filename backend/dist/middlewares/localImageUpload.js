"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Set up multer storage
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join('C:/Users/ASUS/Instabooks/backend/src/uploads');
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath); // Folder to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`); // Naming the uploaded file
    },
});
// Initialize multer with the storage settings
const upload = (0, multer_1.default)({ storage });
// Middleware for uploading a single image file
exports.uploadSingle = upload.single('cover_img');
