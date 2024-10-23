// routes/postRoutes.js
import { Router } from "express";

const router = Router();
import {
  getPosts,
  createPost,
  deletePost,
} from "../controllers/postController.js";

// Get all posts
router.get("/posts", getPosts);

// Create a new post
router.post("/posts", createPost);

// Delete a post by id
router.delete("/posts/:id", deletePost);

export default router;
