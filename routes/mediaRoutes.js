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
