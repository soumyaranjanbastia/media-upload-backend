import { Router } from "express";
const router = Router();
import mediaController from "../controllers/mediaController.js";

router.post(
  "/v1/posts",
  mediaController.uploadFile,
  mediaController.uploadMedia
);
router.get("/v1/media/:id", mediaController.getMediaById);
router.get("/v1/media", mediaController.getAllMedia);

export default router;

// import { Router } from "express";
// import multer from "multer";
// import mediaController from "../controllers/mediaController.js";

// const router = Router();

// // Configure multer for file uploads with memory storage
// const storage = multer.memoryStorage();
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mkv/;
//     const extname = allowedTypes.test(file.originalname.toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error("Only images and videos are allowed"));
//     }
//   },
// });

// router.post(
//   "/v1/posts",
//   upload.array("files"), // This handles multiple files upload
//   mediaController.uploadMedia
// );

// router.get("/v1/media/:id", mediaController.getMediaById);
// router.get("/v1/media", mediaController.getAllMedia);

// export default router;

// import express from "express";
// import multer from "multer";
// import {
//   uploadFile,
//   getMediaById,
//   getAllMedia,
// } from "../controllers/mediaController.js";

// const router = express.Router();

// // Configure multer for file upload
// const upload = multer({ storage: multer.memoryStorage() });

// // Route for uploading files
// router.post("/v1/posts", upload.array("files"), uploadFile);

// // Route for getting a specific media file by ID
// router.get("/v1/posts/:id", getMediaById);

// // Route for getting all media files
// router.get("/v1/getposts", getAllMedia);

// export default router;
