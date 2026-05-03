const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:aishu@localhost:5432/marine_db1"
});

async function main() {
  try {
    const data = await pool.query(`SELECT id, name, type FROM "Vessel"`);
    console.log(JSON.stringify(data.rows, null, 2));
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    await pool.end();
  }
}

main();
