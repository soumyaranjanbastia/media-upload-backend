// /config/dbConfig.js

import { createPool } from "mariadb";

const db = {
  host: "localhost",
  port: "3307",
  user: "root",
  password: "root",
  database: "media_upload",
};

const pool = createPool(db);

export default pool;
