import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const avatarsDir = path.join(__dirname, '../uploads/avatars');

// Ensure directory exists
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

export const deleteUserAvatars = (userId, excludeFile = null) => {
  if (!fs.existsSync(avatarsDir)) return [];

  const files = fs.readdirSync(avatarsDir);
  const userAvatars = files.filter(
    file => file.startsWith(`avatar-${userId}-`) && file !== excludeFile
  );

  const deletedFiles = [];
  for (const avatar of userAvatars) {
    try {
      fs.unlinkSync(path.join(avatarsDir, avatar));
      deletedFiles.push(avatar);
    } catch (err) {
      console.error(`Failed to delete ${avatar}:`, err);
    }
  }
  return deletedFiles;
};

export const getUserAvatarFile = (userId) => {
  if (!fs.existsSync(avatarsDir)) return null;

  const files = fs.readdirSync(avatarsDir);
  return files.find(file => file.startsWith(`avatar-${userId}-`)) || null;
};

export const getAvatarsDir = () => avatarsDir;
