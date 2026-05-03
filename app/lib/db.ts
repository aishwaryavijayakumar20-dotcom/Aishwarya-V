import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:aishu@localhost:5432/marine_db1",
});
