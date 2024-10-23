// models/postModel.js
import { pool } from "../config/db.js"; // Ensure you're using the correct import

export const getAllPosts = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    const query = `
 SELECT
    mf.post_id,
    mf.title,
    mf.description,
    mf.files,
    mf.date,
    mf.user_id,
    u.userName AS postUserName,
    u.profileImg AS postUserProfileImg,  -- Retrieve the profile image for the post user
    SUM(CASE WHEN ld.like_flag = 'l' THEN 1 ELSE 0 END) AS total_likes,
    SUM(CASE WHEN ld.like_flag = 'd' THEN 1 ELSE 0 END) AS total_dislikes,
    SUM(CASE WHEN ld.like_flag = 'v' THEN 1 ELSE 0 END) AS total_love,
    COUNT(DISTINCT c.id) AS total_comments,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'commentId', c.id,
            'comment', c.comment,
            'commentUserName', cu.userName,
            'commentProfileImg', cu.profileImg,  -- Retrieve the profile image for the comment user
            'commentCreatedAt', c.createdAt,
            'commentReactions', IFNULL(cr_counts.reactions, JSON_OBJECT('likes', 0, 'dislikes', 0, 'love', 0))
        )
    ) AS comments
FROM
    media_files mf
LEFT JOIN
    users u ON mf.user_id = u.id
LEFT JOIN
    likes_dislikes ld ON mf.post_id = ld.post_id
LEFT JOIN
    comments c ON mf.post_id = c.postId
LEFT JOIN
    users cu ON c.commentUserId = cu.id
LEFT JOIN (
    SELECT
        commentId,
        JSON_OBJECT(
            'likes', SUM(CASE WHEN reaction = 'l' THEN 1 ELSE 0 END),
            'dislikes', SUM(CASE WHEN reaction = 'd' THEN 1 ELSE 0 END),
            'love', SUM(CASE WHEN reaction = 'v' THEN 1 ELSE 0 END)
        ) AS reactions
    FROM
        comment_reactions
    GROUP BY
        commentId
) cr_counts ON c.id = cr_counts.commentId
GROUP BY
    mf.post_id,
    mf.title,
    mf.description,
    mf.files,
    mf.date,
    mf.user_id,
    u.userName,
    u.profileImg  -- Group by post user's profile image
ORDER BY
    mf.post_id DESC;

    `;

    const rows = await conn.query(query);

    // Manually handle BigInt and convert them to strings
    const processedRows = rows.map(row => {
      // Recursively convert any BigInt values to strings
      const convertBigIntToString = (obj) => {
        for (let key in obj) {
          if (typeof obj[key] === 'bigint') {
            obj[key] = obj[key].toString();
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            // Recursively convert nested objects or arrays
            convertBigIntToString(obj[key]);
          }
        }
      };

      // Apply the conversion to each row
      convertBigIntToString(row);
      return row;
    });

    return processedRows;  // Return the processed rows
  } catch (err) {
    console.error("Error fetching posts:", err);
    return { error: "Failed to fetch posts", details: err.message };
  } finally {
    if (conn) conn.release();
  }
};


// Create a new post
// postModel.js
export const createPost = async (title, description, files, date, user_id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("In model:", title, description, files, date, user_id);

    console.log("Raw Date:", date);

    // Convert and validate the date
    // const parsedDate = new Date(date);
    // if (isNaN(parsedDate.getTime())) {
    //   throw new Error("Invalid da te format");
    // }

    // // Convert the date to UTC format: YYYY-MM-DD HH:MM:SS
    // const formattedDate = parsedDate
    //   .toISOString()
    //   .slice(0, 19)
    //   .replace("T", " ");

    // Make sure to include user_id in the query parameters
    const res = await conn.query(
      "INSERT INTO media_files (user_id, title, description, files, date) VALUES (?, ?, ?, ?, ?)",
      [user_id, title, description, JSON.stringify(files), date] // Include user_id here
    );

    return res; // Return the result of the insertion
  } catch (err) {
    console.error("Error in createPost:", err); // Log the error for debugging
    throw err; // Rethrow the error to be caught in the controller
  } finally {
    if (conn) conn.release(); // Ensure connection is released
  }
};

// Delete a post by id
export const deletePostById = async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const res = await conn.query("DELETE FROM media_files WHERE id = ?", [id]);
    return res;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};
