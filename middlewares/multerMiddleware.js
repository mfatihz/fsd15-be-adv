import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// make sure directory is exist
const uploadDir = path.join(__dirname, '../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true});
}

// storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);//directory to save files
    },
    filename: function (req, file, cb) {
        const userId = req.userId || 'unknown';
        cb(null, 'avatar-' + userId + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: fileFilter
});

// upload only single image
const uploadSingleAvatar  = upload.single('avatar');

export default uploadSingleAvatar ;