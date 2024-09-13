// // /controllers/mediaController.js
// import multer from "multer";
// import { extname as _extname } from "path";
// import pool from "../config/db.js"; // Import the pool
// import { log } from "console";

// // Configure multer for file upload, with max size of 5 MB
// // Update multer configuration to handle multiple files
// // controllers/mediaController.js
// // Configure multer for file upload, with a max size of 5 MB
// const upload = multer({
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mkv/;
//     const extname = allowedTypes.test(
//       _extname(file.originalname).toLowerCase()
//     );
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (extname && mimetype) {
//       return cb(null, true);
//     } else {
//       cb(new Error("Only images and videos are allowed"));
//     }
//   },
// });

// export const uploadFile = upload.array("files"); // Handle multiple files

// export const uploadMedia = async (req, res) => {
//   try {
//     const files = req.files;

//     if (!files || files.length === 0) {
//       console.log(files, " ", files.length);
//       return res.status(400).send("No files uploaded");
//     }

//     const { userId, heading, description, type } = req.body;

//     if (!userId || !description || !type || !heading) {
//       return res.status(400).send("Missing required fields");
//     }

//     const conn = await pool.getConnection();

//     const query = `INSERT INTO media_files (user_id, title, description, type, filename, mimetype, size, data)
//                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

//     for (let file of files) {
//       await conn.query(query, [
//         userId,
//         heading || __filename || "",
//         description,
//         type,
//         file.originalname,
//         file.mimetype,
//         file.size,
//         file.buffer,
//       ]);
//     }

//     conn.release();
//     res.status(200).send("Files uploaded successfully");
//   } catch (err) {
//     console.error("Upload Media Error:", err.message);
//     res.status(500).send("Internal Server Error");
//   }
// };

// const getMediaById = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const conn = await pool.getConnection(); // Get the connection from the pool

//     // SQL query to get the media file and like/dislike counts
//     const query = `
//       SELECT media_files.post_id, media_files.user_id, media_files.title, media_files.description, media_files.type, media_files.filename, media_files.mimetype, media_files.size, media_files.created_at,
//              media_files.data,
//              IFNULL(SUM(CASE WHEN likes_dislikes.like_dislike = 'like' THEN 1 ELSE 0 END), 0) AS likes,
//              IFNULL(SUM(CASE WHEN likes_dislikes.like_dislike = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
//       FROM media_files
//       LEFT JOIN likes_dislikes ON media_files.post_id = likes_dislikes.postid
//       WHERE media_files.post_id = ?
//       GROUP BY media_files.post_id
//     `;

//     const rows = await conn.query(query, [id]);

//     conn.release(); // Release the connection back to the pool

//     if (rows.length === 0) {
//       return res.status(404).send("File not found");
//     }

//     const file = rows[0];

//     // Convert any BigInt values to strings to avoid serialization errors
//     const formattedFile = {
//       post_id: file.post_id.toString(), // Convert BigInt to string
//       user_id: file.user_id.toString(), // Convert BigInt to string
//       title: file.title,
//       description: file.description,
//       type: file.type,
//       filename: file.filename,
//       mimetype: file.mimetype,
//       size: Number(file.size), // Ensure size is a number
//       created_at: file.created_at, // You might convert this to a string if it's a timestamp
//       data: file.data.toString("base64"), // Convert binary data to base64
//       likes: file.likes, // Total likes
//       dislikes: file.dislikes, // Total dislikes
//     };

//     // Send the response as JSON
//     res.status(200).json(formattedFile);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// };

// const getAllMedia = async (req, res) => {
//   try {
//     const conn = await pool.getConnection(); // Get the connection from the pool

//     // SQL query to get media files along with like/dislike counts
//     const query = `
//       SELECT media_files.post_id, media_files.user_id, media_files.title, media_files.description, media_files.type, media_files.filename, media_files.mimetype, media_files.size, media_files.created_at,
//              media_files.data,
//              IFNULL(SUM(CASE WHEN likes_dislikes.like_dislike = 'like' THEN 1 ELSE 0 END), 0) AS likes,
//              IFNULL(SUM(CASE WHEN likes_dislikes.like_dislike = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
//       FROM media_files media_files
//       LEFT JOIN likes_dislikes likes_dislikes ON media_files.post_id = likes_dislikes.postid
//       GROUP BY media_files.post_id
//     `;

//     const rows = await conn.query(query);

//     conn.release(); // Release the connection back to the pool

//     if (rows.length === 0) {
//       return res.status(404).send("No files found");
//     }

//     // Format the response, including likes and dislikes
//     const formattedRows = rows.map((row) => ({
//       ...row,
//       size: Number(row.size), // Ensure size is a number
//       data: row.data.toString("base64"), // Convert binary data to base64 string
//       likes: row.likes, // Total likes
//       dislikes: row.dislikes, // Total dislikes
//     }));

//     // Send the formatted data as a JSON response
//     res.status(200).json(formattedRows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// };
// export default {
//   uploadFile,
//   uploadMedia,
//   getMediaById,
//   getAllMedia,
// };

import { extname as _extname } from "path";
import pool from "../config/db.js"; // Import the pool
import multer from "multer";

//Configure multer for file upload, with memory storage (buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mkv/;
    const extname = allowedTypes.test(
      _extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed"));
    }
  },
});
export const uploadMedia = upload.array("files");
export const uploadFile = async (req, res) => {
  console.log("Received data:", req.body); // Add this for debugging
  try {
    const { userId, heading, description, type } = req.body;

    if (!req.files || req.files.length === 0) {
      console.log(req.files, " ", req.files.length);
      return res.status(400).send("No files uploaded");
    }

    const conn = await pool.getConnection();

    for (const file of req.files) {
      const query = `INSERT INTO media_files (user_id, title, description, file_type, file_data) VALUES (?, ?, ?, ?, ?)`;

      await conn.query(query, [
        userId || null,
        heading || null,
        description || null,
        type || null,
        file.buffer, // file.buffer contains the file data as a Buffer
      ]);
    }

    conn.release();
    res.status(200).send("Files uploaded successfully");
  } catch (err) {
    console.error("Upload File Error:", err.message);
    res.status(500).send("Internal Server Error");
  }
};

export const getMediaById = async (req, res) => {
  try {
    const id = req.params.id;

    const conn = await pool.getConnection(); // Get the connection from the pool

    // SQL query to get the media file and like/dislike counts
    // const query = `
    //   SELECT media_files.post_id, media_files.user_id, media_files.title, media_files.description, media_files.type, media_files.filename, media_files.mimetype, media_files.size, media_files.created_at,
    //          media_files.data,
    //          IFNULL(SUM(CASE WHEN likes_dislikes.like_dislike = 'like' THEN 1 ELSE 0 END), 0) AS likes,
    //          IFNULL(SUM(CASE WHEN likes_dislikes.like_dislike = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
    //   FROM media_files
    //   LEFT JOIN likes_dislikes ON media_files.post_id = likes_dislikes.postid
    //   WHERE media_files.post_id = ?
    //   GROUP BY media_files.post_id
    // `;
    const query = `SELECT * FROM media_files WHERE id = ?`;
    const rows = await conn.query(query, [id]);

    conn.release(); // Release the connection back to the pool

    if (rows.length === 0) {
      return res.status(404).send("File not found");
    }

    const file = rows[0];

    // Convert any BigInt values to strings to avoid serialization errors
    const formattedFile = {
      post_id: file.post_id.toString(), // Convert BigInt to string
      user_id: file.user_id.toString(), // Convert BigInt to string
      title: file.title,
      description: file.description,
      type: file.type,
      // filename: file.filename,
      // mimetype: file.mimetype,
      // size: Number(file.size), // Ensure size is a number
      // created_at: file.created_at, // You might convert this to a string if it's a timestamp
      // data: file.data.toString("base64"), // Convert binary data to base64
      // likes: file.likes, // Total likes
      // dislikes: file.dislikes, // Total dislikes
    };

    // Send the response as JSON
    res.status(200).json(formattedFile);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllMedia = async (req, res) => {
  try {
    const conn = await pool.getConnection(); // Get the connection from the pool

    // SQL query to get media files along with like/dislike counts
    // const query = `
    //   SELECT media_files.post_id, media_files.user_id, media_files.title, media_files.description, media_files.type, media_files.filename, media_files.mimetype, media_files.size, media_files.created_at,
    //          media_files.data,
    //          IFNULL(SUM(CASE WHEN likes_dislikes.like_dislike = 'like' THEN 1 ELSE 0 END), 0) AS likes,
    //          IFNULL(SUM(CASE WHEN likes_dislikes.like_dislike = 'dislike' THEN 1 ELSE 0 END), 0) AS dislikes
    //   FROM media_files media_files
    //   LEFT JOIN likes_dislikes likes_dislikes ON media_files.post_id = likes_dislikes.postid
    //   GROUP BY media_files.post_id
    // `;
    const query = `SELECT * FROM media_files`;
    const rows = await conn.query(query);

    conn.release(); // Release the connection back to the pool

    if (rows.length === 0) {
      return res.status(404).send("No files found");
    }

    // Format the response, including likes and dislikes
    const formattedRows = rows.map((row) => ({
      ...row,
      size: Number(row.size), // Ensure size is a number
      data: row.data.toString("base64"), // Convert binary data to base64 string
      likes: row.likes, // Total likes
      dislikes: row.dislikes, // Total dislikes
    }));

    // Send the formatted data as a JSON response
    res.status(200).json(formattedRows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export default {
  uploadMedia,
  uploadFile,
  getMediaById,
  getAllMedia,
};
