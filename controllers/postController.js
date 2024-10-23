import {
  getAllPosts,
  createPost as createPostInModel,
  deletePostById,
} from "../model/postModel.js";
import multer from "multer";

// Multer configuration
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage }).single('image');

// Fetch all posts
export async function getPosts(req, res) {
  try {
    const posts = await getAllPosts();
    console.log("Post data ", posts); // Should now be an array
    console.log("Array data ", Array.isArray(posts)); // Should return true

    // If necessary, perform additional serialization
    const serializedPosts = posts.map(post => {
      return {
        ...post,
        total_likes: post.total_likes || "0", // Use default value if missing
        total_dislikes: post.total_dislikes || "0",
        total_love: post.total_love || "0"
      };
    });

    res.status(200).json(serializedPosts);
  } catch (error) {
    console.error("Error in getPosts:", error.message); // Log the error message
    res.status(500).json({ error: "Failed to fetch posts", details: error.message });
  }
}

// Create a new post
export async function createPost(req, res) {
  // upload(req, res, async function (err) {
  //     if (err) {
  //         console.error('Multer error:', err);
  //         return res.status(500).json({ error: 'Error uploading image' });
  //     }

  // });

  const { title, description, files, date, user_id } = req.body;

  console.log("Body:", req.body);
  console.log(
    "Title:",
    title,
    "Description:",
    description,
    "in request Date:",
    date,
    "Image:",
    files,
    "userId : ",
    user_id
  );

  try {
    const newPost = await createPostInModel(
      title,
      description,
      files,
      date,
      user_id
    );
    // Convert IDs to string if necessary
    res.status(201).json({
      post_id: String(newPost.insertId), // Assuming insertId returns the post_id
      title,
      description,
      user_id,
      type: "image",
      files: "",
      date,
    });
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
}

// Delete a post
export async function deletePost(req, res) {
  const { id } = req.params;
  try {
    await deletePostById(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
}
