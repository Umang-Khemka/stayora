import multer from "multer";

// Disk storage is not needed; we just want the file in memory
const storage = multer.diskStorage({});

// Multer instance
export const upload = multer({ storage });
