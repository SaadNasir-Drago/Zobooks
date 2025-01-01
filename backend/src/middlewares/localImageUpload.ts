import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join('C:/Users/ASUS/Instabooks/backend/src/uploads');
   
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath); // Folder to save uploaded files
  },
  filename: (req, file, cb) => {
    
    cb(null, `${file.originalname}`); // Naming the uploaded file
  },
});

// Initialize multer with the storage settings
const upload = multer({ storage });

// Middleware for uploading a single image file
export const uploadSingle = upload.single('cover_img');