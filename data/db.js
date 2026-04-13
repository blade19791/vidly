import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// pool.on("connect", () => console.log("PostgreSQL pool connected..."));
// pool.on("error", (err) => console.log("Unexpected DB error: ", err.message));

export default pool;
