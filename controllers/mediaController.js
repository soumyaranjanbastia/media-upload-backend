// /controllers/mediaController.js
import multer from "multer";
import { extname as _extname } from "path";
import pool from "../config/db.js"; // Import the pool

// Configure multer for file upload, with max size of 5 MB
const upload = multer({
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

const uploadFile = upload.single("file");

const uploadMedia = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const conn = await pool.getConnection(); // Get the connection from the pool
    const { originalname: filename, mimetype, size, buffer } = file;

    const query = `INSERT INTO media_files (filename, mimetype, size, data) VALUES (?, ?, ?, ?)`;
    await conn.query(query, [filename, mimetype, size, buffer]);

    conn.release(); // Release the connection back to the pool
    res.status(200).send("File uploaded successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getMediaById = async (req, res) => {
  try {
    const id = req.params.id;

    const conn = await pool.getConnection(); // Get the connection from the pool
    const query = `SELECT * FROM media_files WHERE id = ?`;
    const rows = await conn.query(query, [id]);

    conn.release(); // Release the connection back to the pool

    if (rows.length === 0) {
      return res.status(404).send("File not found");
    }

    const file = rows[0];

    res.setHeader("Content-Type", file.mimetype);
    res.setHeader("Content-Disposition", "inline; filename=" + file.filename);
    res.send(file.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const getAllMedia = async (req, res) => {
  try {
    const conn = await pool.getConnection(); // Get the connection from the pool
    const query = `SELECT id, filename, mimetype, size, created_at FROM media_files`;
    const rows = await conn.query(query);

    conn.release(); // Release the connection back to the pool

    if (rows.length === 0) {
      return res.status(404).send("No files found");
    }

    const formattedRows = rows.map((row) => ({
      ...row,
      size: Number(row.size),
    }));

    res.status(200).json(formattedRows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

export default {
  uploadFile,
  uploadMedia,
  getMediaById,
  getAllMedia,
};
