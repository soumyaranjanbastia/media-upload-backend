// import db from "../config/db.js";

// export async function createArticle(req, res) {
//   try {
//     const { heading, description } = req.body;

//     if (!heading || !description) {
//       return res
//         .status(400)
//         .json({ message: "Heading and description are required" });
//     }

//     const conn = await pool.getConnection();
//     const result = await conn.query(
//       "INSERT INTO articles (heading, description) VALUES (?, ?)",
//       [heading, description]
//     );
//     conn.release();

//     res
//       .status(200)
//       .json({ message: "Article created successfully", id: result.insertId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }
