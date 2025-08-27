import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadAvatar = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const uploadedFile = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/avatars/${req.file.filename}`,
      uploadedAt: new Date()
    };

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      file: uploadedFile
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during upload'
    });
  }
};

export const getAvatar = (req, res) => {
  try {
    const filename = req.params.filename;
    const avatarPath = path.join(__dirname, '../uploads/avatars', filename);

    if (!fs.existsSync(avatarPath)) {
      return res.status(404).json({
        success: false,
        message: 'Avatar image not found'
      });
    }

    res.sendFile(avatarPath);
  } catch (error) {
    console.error('Get avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteAvatar = (req, res) => {
  try {
    const filename = req.params.filename;
    const avatarPath = path.join(__dirname, '../uploads/avatars', filename);

    if (!fs.existsSync(avatarPath)) {
      return res.status(404).json({
        success: false,
        message: 'Avatar image not found'
      });
    }

    fs.unlinkSync(avatarPath);
    
    res.status(200).json({
      success: true,
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get avatar by user ID (if you store user-avatar mapping)
export const getAvatarByUserId = (req, res) => {
  try {
    const userId = req.params.userId;
    
    // TODO: update using query filename from database
    const avatarsDir = path.join(__dirname, '../uploads/avatars');
    const files = fs.readdirSync(avatarsDir);
    const userAvatar = files.find(file => file.includes(`avatar-${userId}-`));
    
    if (!userAvatar) {
      return res.status(404).json({
        success: false,
        message: 'Avatar not found for this user'
      });
    }

    const avatarPath = path.join(avatarsDir, userAvatar);
    res.sendFile(avatarPath);
  } catch (error) {
    console.error('Get avatar by user ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};