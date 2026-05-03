const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:aishu@localhost:5432/marine_db1"
});

const updates = [
  { id: 'au_1', image: '/vessels/cargo_ship.png' },
  { id: 'au_2', image: '/vessels/bulk_carrier.png' },
  { id: 'au_3', image: '/vessels/towboat.png' },
  { id: 'au_4', image: '/vessels/bulk_carrier_2.png' },
  { id: 'au_5', image: '/vessels/large_bulk_carrier.png' }
];

async function main() {
  try {
    for (const update of updates) {
      await pool.query('UPDATE "Vessel" SET image = $1 WHERE id = $2', [update.image, update.id]);
      console.log(`Updated vessel ${update.id} with image ${update.image}`);
    }
    console.log("All images updated successfully.");
  } catch (err) {
    console.error("DB Error:", err.message);
  } finally {
    await pool.end();
  }
}

main();
