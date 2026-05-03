const axios = require('axios');
const cheerio = require('cheerio');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgresql://postgres:aishu@localhost:5432/marine_db1"
});

async function fetchImages(query) {
  try {
    const res = await axios.get(`https://unsplash.com/s/photos/${query}`);
    const $ = cheerio.load(res.data);
    const images = [];
    $('img[srcset]').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.includes('images.unsplash.com/photo-') && !src.includes('profile-')) {
        // Strip query params and add our own
        const baseUrl = src.split('?')[0];
        images.push(`${baseUrl}?w=800&q=80`);
      }
    });
    // Return unique images
    return [...new Set(images)];
  } catch (err) {
    console.error(`Failed to fetch ${query}:`, err.message);
    return [];
  }
}

async function main() {
  const types = ['sailboat', 'yacht', 'cargo-ship', 'fishing-boat', 'motorboat'];
  const imageMap = {};
  for (const t of types) {
    console.log(`Fetching images for ${t}...`);
    imageMap[t] = await fetchImages(t);
    console.log(`Found ${imageMap[t].length} images for ${t}`);
  }

  try {
    const { rows } = await pool.query('SELECT id, name, type FROM "Vessel" WHERE id NOT IN ($1, $2, $3, $4, $5)', ['au_1', 'au_2', 'au_3', 'au_4', 'au_5']);
    
    for (const vessel of rows) {
      let category = 'yacht';
      if (vessel.type.includes('Cargo') || vessel.name.includes('DWT')) category = 'cargo-ship';
      else if (vessel.type.includes('Sailboat') || vessel.name.includes('Ketch') || vessel.name.includes('Sloop')) category = 'sailboat';
      else if (vessel.type.includes('Fishing')) category = 'fishing-boat';
      else if (vessel.type.includes('Motor') || vessel.type.includes('Powerboat')) category = 'motorboat';

      const images = imageMap[category];
      if (images && images.length > 0) {
        // Pick a random image and remove it so it's unique
        const idx = Math.floor(Math.random() * images.length);
        const imgUrl = images.splice(idx, 1)[0];
        
        await pool.query('UPDATE "Vessel" SET image = $1 WHERE id = $2', [imgUrl, vessel.id]);
        console.log(`Updated ${vessel.id} (${vessel.name}) with ${category} image`);
      } else {
        console.log(`Ran out of images for ${category}, vessel ${vessel.id} skipped.`);
      }
    }
  } catch(e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

main();
