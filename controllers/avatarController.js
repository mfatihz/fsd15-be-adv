import path from 'path';
import { deleteUserAvatars, getUserAvatarFile, getAvatarsDir } from '../services/avatarService.js';

export const uploadAvatar = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Delete old avatars except the newly uploaded one
    const userId = req.userId;
    deleteUserAvatars(userId, req.file.filename);

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

export const getAvatarByUserId = (req, res) => {
  try {
    const userId = req.userId;
    const avatarFile = getUserAvatarFile(userId);

    if (!avatarFile) {
      return res.status(404).json({
        success: false,
        message: "User's avatar not found."
      });
    }

    const avatarPath = path.join(getAvatarsDir(), avatarFile);
    res.sendFile(avatarPath);
  } catch (error) {
    console.error('Get avatar by user ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const deleteAvatar = (req, res) => {
  try {
    const userId = req.userId;
    const deletedFiles = deleteUserAvatars(userId);

    if (deletedFiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User's avatar not found."
      });
    }

    res.status(200).json({
      success: true,
      message: 'Avatar deleted successfully',
      deleted: deletedFiles
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
