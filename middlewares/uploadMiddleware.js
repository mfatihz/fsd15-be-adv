import multer from "multer"

export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ 
          success: false,
          message: 'File too large. Maximum size is 5MB.' 
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ 
          success: false,
          message: 'Only one avatar image allowed.' 
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ 
          success: false,
          message: 'Too many files uploaded.' 
        });
      default:
        return res.status(400).json({ 
          success: false,
          message: 'File upload error: ' + error.message 
        });
    }
  }
  
  if (error.message.includes('image files')) {
    return res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }

  next(error);
}

export const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      message: 'No file uploaded. Please select an image file.' 
    });
  }
  
  // Additional validation
  if (req.file.size === 0) {
    return res.status(400).json({ 
      success: false,
      message: 'Uploaded file is empty.' 
    });
  }
  
  next();
};