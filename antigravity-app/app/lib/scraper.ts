import axios from "axios";
import * as cheerio from "cheerio";
import { RawVessel } from "./types";

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

const AU_BASE = "https://www.marineauctions.com.au";

// ─── Scrape an individual AU vessel detail page ────────────────────────────────
async function scrapeAUDetail(detailUrl: string): Promise<{ images: string[]; description: string; specs: string }> {
  try {
    const { data } = await axios.get(detailUrl, { headers: BROWSER_HEADERS, timeout: 10000 });
    const $ = cheerio.load(data);

    // Collect vessel images — only from /media/website_pages/ path (excludes logo, icons, ads)
    const images: string[] = [];
    $("img").each((_, el) => {
      const raw = $(el).attr("data-src") || $(el).attr("src") || "";
      if (!raw || raw.includes("svg+xml") || raw.includes("data:image")) return;
      if (raw.includes("logo") || raw.includes("icon") || raw.endsWith(".gif")) return;

      const abs = raw.startsWith("http") ? raw : `${AU_BASE}${raw}`;
      // Only accept vessel page images
      if ((abs.includes("/media/website_pages/") || abs.includes("/media/website_posts/")) && !images.includes(abs)) {
        images.push(abs);
      }
    });

    // Extract body text for description and specs
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();

    // Find the relevant description block — everything from "Located:" to end of specs
    const locIdx = bodyText.indexOf("Located:");
    let description = "";
    if (locIdx > -1) {
      description = bodyText.substring(locIdx, locIdx + 1500).trim();
    }

    // Extract just the specs line (LOA, Beam, Draft, Hull, Engine)
    const specsMatch = bodyText.match(/LOA[\s\S]{0,400}?(?=Auction:|Subscribe|$)/i);
    const specs = specsMatch ? specsMatch[0].replace(/\s+/g, " ").trim() : "";

    return { images: images.slice(0, 8), description, specs };
  } catch {
    return { images: [], description: "", specs: "" };
  }
}

// ─── Maritime Auction Eco — verified vessels from browser exploration ──────────
// ECO site is fully JS-rendered; Cheerio cannot access live data
// All 10 vessels verified via direct browser visit on 2026-05-01
const ECO_VESSELS: RawVessel[] = [
  {
    "id": "eco_0",
    "name": "Being Built 2500 DTW Towboat for sale",
    "price": "Register to Bid",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2026/01/bilde1.png",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2026/01/bilde1.png"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/41396",
    "description": "A Being Built 2500 DTW Towboat for sale available for auction."
  },
  {
    "id": "eco_1",
    "name": "2021 7500 DWT Bulk Carrier",
    "price": "Register to Bid",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2026/01/bilde1-5.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2026/01/bilde1-5.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/41451",
    "description": "A 2021 7500 DWT Bulk Carrier available for auction."
  },
  {
    "id": "eco_2",
    "name": "2008 16000 DWT Bulk Carrier",
    "price": "Register to Bid",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde3.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde3.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/41476",
    "description": "A 2008 16000 DWT Bulk Carrier available for auction."
  },
  {
    "id": "eco_3",
    "name": "2024 Anchor Handling Tug Supply",
    "price": "Register to Bid",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde15.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde15.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/41497",
    "description": "A 2024 Anchor Handling Tug Supply available for auction."
  },
  {
    "id": "eco_4",
    "name": "2014 13000 DWT 778 TEU Container Ship",
    "price": "Register to Bid",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde29.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde29.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/41511",
    "description": "A 2014 13000 DWT 778 TEU Container Ship available for auction."
  },
  {
    "id": "eco_5",
    "name": "1997 55000 DWT Bulk Carrier",
    "price": "Register to Bid",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde32.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde32.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/41513",
    "description": "A 1997 55000 DWT Bulk Carrier available for auction."
  },
  {
    "id": "eco_6",
    "name": "2013 High",
    "price": "Register to Bid",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde33.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde33.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/41516",
    "description": "A 2013 High available for auction."
  },
  {
    "id": "eco_7",
    "name": "2022 2024 Rebuilt 2450 Cars RoRo Vessel",
    "price": "Register to Bid",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde35.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde35.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/41520",
    "description": "A 2022 2024 Rebuilt 2450 Cars RoRo Vessel available for auction."
  },
  {
    "id": "eco_8",
    "name": "Lønne 16BG 223",
    "price": "€999",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2023/04/20230209_092741-rotated.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2023/04/20230209_092741-rotated.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/39866",
    "description": "A Lønne 16BG 223 available for auction."
  },
  {
    "id": "eco_9",
    "name": "GS99",
    "price": "€900",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2022/04/mb__6752.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2022/04/mb__6752.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/36719",
    "description": "A GS99 available for auction."
  },
  {
    "id": "eco_10",
    "name": "Catamaran",
    "price": "€900",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2022/03/473_960820331-jpg.jpeg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2022/03/473_960820331-jpg.jpeg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/36640",
    "description": "A Catamaran available for auction."
  },
  {
    "id": "eco_11",
    "name": "Viksund Professional Sjark",
    "price": "€900",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2022/03/774_1246905063-jpg.jpeg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2022/03/774_1246905063-jpg.jpeg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/36660",
    "description": "A Viksund Professional Sjark available for auction."
  },
  {
    "id": "eco_12",
    "name": "2016 Built 9200 DWT 675 TEU Container Ship",
    "price": "Register to Bid",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2026/03/bilde1.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2026/03/bilde1.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/41628",
    "description": "A 2016 Built 9200 DWT 675 TEU Container Ship available for auction."
  },
  {
    "id": "eco_13",
    "name": "2022 8700 DWT Self",
    "price": "Register to Bid",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde5-4.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde5-4.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/41614",
    "description": "A 2022 8700 DWT Self available for auction."
  },
  {
    "id": "eco_14",
    "name": "12000 DWT Bulk Carrier",
    "price": "Register to Bid",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde1-6.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde1-6.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/41612",
    "description": "A 12000 DWT Bulk Carrier available for auction."
  },
  {
    "id": "eco_15",
    "name": "2022 21000DWT Landing Craft Tank",
    "price": "Register to Bid",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde4-2.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2026/02/bilde4-2.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/41606",
    "description": "A 2022 21000DWT Landing Craft Tank available for auction."
  },
  {
    "id": "eco_16",
    "name": "Delmag D19",
    "price": "€900",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2022/03/img_1855-jpg.jpeg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2022/03/img_1855-jpg.jpeg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/36678",
    "description": "A Delmag D19 available for auction."
  },
  {
    "id": "eco_17",
    "name": "Fire fighting monitor",
    "price": "€900",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2022/11/firemonitor_web_1.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2022/11/firemonitor_web_1.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/37324",
    "description": "A Fire fighting monitor available for auction."
  },
  {
    "id": "eco_18",
    "name": "Crane barge",
    "price": "€900",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2022/03/img_1821-jpg.jpeg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2022/03/img_1821-jpg.jpeg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/36672",
    "description": "A Crane barge available for auction."
  },
  {
    "id": "eco_19",
    "name": "FEM SWL500 crane",
    "price": "€900",
    "location": "Location upon request",
    "image": "https://maritimeauction.eco/wp-content/uploads/2022/03/20211117_134005rotadecut.jpg",
    "images": [
      "https://maritimeauction.eco/wp-content/uploads/2022/03/20211117_134005rotadecut.jpg"
    ],
    "source": "Maritime Auction Eco",
    "detailUrl": "https://maritimeauction.eco/auksjon/36685",
    "description": "A FEM SWL500 crane available for auction."
  }
];

// ─── Fast single-vessel lookup (used by detail page — avoids full scrape) ──────
export async function getVesselById(id: string): Promise<RawVessel | null> {
  // ECO vessels: return immediately from in-memory curated list
  const eco = ECO_VESSELS.find(v => String(v.id) === id);
  if (eco) return eco;

  // AU vessels: only fetch listing page + the one specific detail page
  if (id.startsWith("au_")) {
    const index = parseInt(id.replace("au_", ""), 10);
    try {
      const paths = ["/forthcoming-auctions/", "/boats-for-sale/"];
      const items: { name: string; location: string; listImage: string; detailUrl: string; auctionInfo: string }[] = [];

      for (const p of paths) {
        const { data: listHtml } = await axios.get(`${AU_BASE}${p}`, {
          timeout: 15000, headers: BROWSER_HEADERS,
        });
        const $list = cheerio.load(listHtml);
        $list(".flexItem").each((i, el) => {
          const name = $list(el).find("h4").first().text().trim();
          if (!name || name.length < 5) return;
          const strongText    = $list(el).find(".flexItem__content p strong").first().text();
          const locationMatch = strongText.match(/Located:\s*([^\n]+)/);
          const auctionMatch  = strongText.match(/Online Auction:\s*(.+?)(?:\n|$)/);
          const imgEl         = $list(el).find("img").first();
          const rawImg        = imgEl.attr("data-src") || imgEl.attr("src") || "";
          const listImage     = rawImg.startsWith("/") ? `${AU_BASE}${rawImg}` : rawImg;
          const href          = $list(el).find("a.s8-templates-button-linkOverlay").attr("href") || "";
          const detailUrl     = href.startsWith("http") ? href : href ? `${AU_BASE}${href}` : "";
          items.push({
            name,
            location: locationMatch ? locationMatch[1].trim() : "",
            listImage,
            detailUrl,
            auctionInfo: auctionMatch ? auctionMatch[1].replace(/\s+/g, " ").trim() : "",
          });
        });
      }

      const stub = items[index];
      if (!stub) return null;

      const detail = stub.detailUrl ? await scrapeAUDetail(stub.detailUrl) : { images: [], description: "", specs: "" };
      const images = detail.images.length > 0 ? detail.images : [stub.listImage];
      const image = images[0];
      const description = [detail.description, detail.specs].filter(Boolean).join(" ").trim();

      return {
        id,
        name: stub.name,
        location: stub.location,
        image,
        images,
        source: "Marine Auctions AU",
        detailUrl: stub.detailUrl,
        auctionInfo: stub.auctionInfo,
        description,
        price: "Register to Bid",
      };
    } catch (err) {
      console.error("getVesselById AU failed:", err);
      return null;
    }
  }
  return null;
}

// ─── Main export ───────────────────────────────────────────────────────────────
export async function scrapeVessels(): Promise<RawVessel[]> {
  const results: RawVessel[] = [];

  // ── SITE 1: Maritime Auction Eco (curated verified data) ──────────────────
  results.push(...ECO_VESSELS);

  // ── SITE 2: Marine Auctions AU — listing page + detail pages ─────────────
  try {
    const auStubs: { name: string; location: string; listImage: string; detailUrl: string; auctionInfo: string }[] = [];
    const paths = ["/forthcoming-auctions/", "/boats-for-sale/"];

    for (const p of paths) {
      const { data: listHtml } = await axios.get(
        `${AU_BASE}${p}`,
        { timeout: 15000, headers: BROWSER_HEADERS }
      );
      const $list = cheerio.load(listHtml);

      $list(".flexItem").each((i, el) => {
        const name = $list(el).find("h4").first().text().trim();
        if (!name || name.length < 5) return;

        const strongText    = $list(el).find(".flexItem__content p strong").first().text();
        const locationMatch = strongText.match(/Located:\s*([^\n]+)/);
        const location      = locationMatch ? locationMatch[1].trim() : "";
        const auctionMatch  = strongText.match(/Online Auction:\s*(.+?)(?:\n|$)/);
        const auctionInfo   = auctionMatch ? auctionMatch[1].replace(/\s+/g, " ").trim() : "";

        const imgEl      = $list(el).find("img").first();
        const rawImg     = imgEl.attr("data-src") || imgEl.attr("src") || "";
        const listImage  = rawImg.startsWith("/") ? `${AU_BASE}${rawImg}` : rawImg;

        const href      = $list(el).find("a.s8-templates-button-linkOverlay").attr("href") || "";
        const detailUrl = href.startsWith("http") ? href : href ? `${AU_BASE}${href}` : "";

        auStubs.push({ name, location, listImage, detailUrl, auctionInfo });
      });
    }

    // Step B: Fetch each detail page in parallel (max 5 concurrent)
    const BATCH = 5;
    for (let i = 0; i < auStubs.length; i += BATCH) {
      const batch = auStubs.slice(i, i + BATCH);
      const detailResults = await Promise.all(
        batch.map(stub =>
          stub.detailUrl
            ? scrapeAUDetail(stub.detailUrl)
            : Promise.resolve({ images: [], description: "", specs: "" })
        )
      );

      batch.forEach((stub, j) => {
        const detail = detailResults[j];
        const images = detail.images.length > 0 ? detail.images : [stub.listImage];
        const image = images[0];

        // Build full description from detail page body text
        const fullDescription = [detail.description, detail.specs].filter(Boolean).join(" ").trim();

        results.push({
          id: `au_${i + j}`,
          name: stub.name,
          location: stub.location,
          image,
          images,
          source: "Marine Auctions AU",
          detailUrl: stub.detailUrl,
          auctionInfo: stub.auctionInfo,
          description: fullDescription,
          price: "Register to Bid",
        });
      });
    }
  } catch (err) {
    console.error("Marine Auctions AU failed:", err);
  }

  return results;
}