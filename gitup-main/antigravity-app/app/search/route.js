import { pool } from "../lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  try {
    let result;
    if (query) {
      result = await pool.query(
        `SELECT * FROM "Vessel" WHERE name ILIKE $1 OR location ILIKE $1 OR type ILIKE $1`,
        [`%${query}%`]
      );
    } else {
      result = await pool.query(`SELECT * FROM "Vessel"`);
    }

    return Response.json(result.rows);
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Failed to search vessels" }, { status: 500 });
  }
}