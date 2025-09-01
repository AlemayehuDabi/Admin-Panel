import multer from "multer";

const storage = multer.memoryStorage();

// Configure Multer with limits and file filter
export const upload = multer({
  storage,
  limits: {
    files: 1, // Explicitly limit to 1 file
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  }
});