// /config/db.js

import { createPool } from "mariadb";

const dbConfig = {
  host: "localhost",
  port: "3306",
  user: "root",
  password: "root",
  database: "media",
};

const pool = createPool(dbConfig);

// Export the pool for use in other files
export { pool };
