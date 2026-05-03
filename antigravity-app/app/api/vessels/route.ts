import { pool } from "../../lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM "Vessel" ORDER BY id');
    return Response.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    return Response.json({ error: "Failed to fetch vessels from database" }, { status: 500 });
  }
}