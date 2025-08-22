import multer from "multer"

export const handleMulterError = (error, req, res, next) => {
    console.log("handleMulterError")
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large. maximum size is 5MB.' });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ message: 'Only one avatar image allowed.' });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ message: 'Too many files uploaded.' });
        }
    }
    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({ message: error.message });
    }

    // Handle other errors
    return res.status(400).json({ message: 'File upload failed: ' + error.message });
}

export const validateFileUpload = (req, res, next) => {
    console.log("validateFileUpload")
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded. Please select an image file.' });
    }
    next();
};