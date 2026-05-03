import { RawVessel, Vessel } from "./types";

// ─── Fallback marine stock images (cycling) ───────────────────────────────────
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800",
  "https://images.unsplash.com/photo-1500417148159-68083bd7333a?w=800",
  "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800",
  "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=800",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
];

// ────────────────────────────────────────────────────────────────────────────
// STEP 1 — VALIDATE
// Remove records that are clearly malformed or useless
// ────────────────────────────────────────────────────────────────────────────
function validate(records: RawVessel[]): RawVessel[] {
  const before = records.length;
  const valid = records.filter(r => {
    if (!r.name || typeof r.name !== "string") return false;
    if (r.name.trim().length < 5) return false;
    // Reject navigation/UI text that leaked into scraping
    const junk = /subscribe|newsletter|menu|click here|read more|javascript|undefined/i;
    if (junk.test(r.name)) return false;
    return true;
  });
  console.log(`[VALIDATE] ${before} records → ${valid.length} valid (removed ${before - valid.length})`);
  return valid;
}

// ────────────────────────────────────────────────────────────────────────────
// STEP 2 — DEDUPLICATE
// Remove vessels with the same name (keep first occurrence)
// ────────────────────────────────────────────────────────────────────────────
function deduplicate(records: RawVessel[]): RawVessel[] {
  const seen = new Set<string>();
  const unique = records.filter(r => {
    const key = r.name.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`[DEDUPLICATE] ${records.length} records → ${unique.length} unique`);
  return unique;
}

// ────────────────────────────────────────────────────────────────────────────
// STEP 3 — NORMALIZE
// Standardize location, price, and image fields
// ────────────────────────────────────────────────────────────────────────────
function normalize(r: RawVessel, index: number): RawVessel {
  // Clean name — remove extra whitespace, HTML entities
  const name = r.name
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  // Normalize location — strip "Located:" prefix, take first line
  const rawLocation = (r.location || "").replace(/Located:\s*/i, "").split("\n")[0].trim();
  const location = rawLocation.length > 2 ? rawLocation : "Location Not Specified";

  // Normalize price — ensure currency symbol present
  let price = (r.price || "").trim();
  if (!price) price = "Register to Bid";
  else if (/^\d/.test(price)) price = `$${price}`; // add $ if missing

  // Normalize image — reject SVG placeholders and relative paths
  let image = (r.image || "").trim();
  if (!image || image.includes("svg+xml") || image.startsWith("data:")) {
    image = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  } else if (image.startsWith("/")) {
    image = `https://www.marineauctions.com.au${image}`;
  }

  return { ...r, name, location, price, image };
}

// ────────────────────────────────────────────────────────────────────────────
// STEP 4 — ANALYZE & ENRICH
// Extract structured fields from free-text vessel name + metadata
// ────────────────────────────────────────────────────────────────────────────
function analyze(r: RawVessel, index: number): Vessel {
  const name = r.name;
  const lower = name.toLowerCase();

  // --- Extract year ---
  const yearMatch = name.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? yearMatch[0] : "Unknown";

  // --- Classify vessel type ---
  let type = "Vessel";
  if (/bulk carrier|cargo|tanker|container|dwt/i.test(lower))        type = "Commercial Cargo";
  else if (/landing craft|towboat|tug|dredge|survey vessel/i.test(lower)) type = "Commercial Work";
  else if (/charter|dive vessel|patrol/i.test(lower))                type = "Commercial";
  else if (/pilothouse|cruiser|flybridge|motor/i.test(lower))        type = "Motor Cruiser";
  else if (/ketch|sloop|cutter|sail|yacht/i.test(lower))            type = "Sailboat";
  else if (/sports|saxdor|quicksilver|wave|powerboat/i.test(lower)) type = "Powerboat";
  else if (/timber|classic|vintage/i.test(lower))                   type = "Classic";
  else if (/trawler|fishing/i.test(lower))                           type = "Fishing Vessel";

  // --- Auction status ---
  const isUnreserved = /unreserved/i.test(lower);
  const status = isUnreserved ? "🔴 Unreserved" : "🟢 Upcoming Auction";

  // --- Quality check ---
  const missingFields: string[] = [];
  if (!r.location || r.location === "Location Not Specified") missingFields.push("location");
  if (!r.image || r.image.includes("unsplash")) missingFields.push("original image");
  if (year === "Unknown") missingFields.push("year");
  if (missingFields.length > 0) {
    console.log(`[QUALITY] "${name.substring(0, 40)}" — missing: ${missingFields.join(", ")}`);
  }

  // --- Build description ---
  const locationStr = r.location && r.location !== "Location Not Specified" ? `Located in ${r.location}.` : "";
  const unreservedNote = isUnreserved
    ? "This vessel is unreserved and must be sold — a genuine opportunity for buyers."
    : "Register to place your bid before the auction closing date.";
  const auctionNote = r.auctionInfo ? `Bidding details: ${r.auctionInfo}` : "";

  // Use the scraped full description if available; otherwise build one
  const description = r.description && r.description.trim().length > 30
    ? r.description.trim()
    : [
        `${name} is a ${type.toLowerCase()} listed for auction by ${r.source || "unknown source"}.`,
        locationStr,
        unreservedNote,
        auctionNote,
        year !== "Unknown" ? `Year: ${year}.` : "",
      ].filter(Boolean).join(" ");

  // --- Extract Specs ---
  const extractSpec = (regex: RegExp, fallback?: string) => {
    const match = description.match(regex);
    return match ? match[1].trim() : fallback;
  };

  const length = r.length || extractSpec(/(?:LOA|Length)[^\d]*([\d.]+\s*m)/i);
  const beam = r.beam || extractSpec(/Beam[^\d]*([\d.]+\s*m)/i);
  const hull = r.hull || extractSpec(/Hull(?: Material|)[^\w]*(Steel|Aluminum|Aluminium|Fibreglass|GRP|Wood|Timber)/i);
  const engine = r.engine || extractSpec(/Engine[^\w]*(?:Make|)[^\w]*([A-Za-z0-9 ]{2,30})(?:hp|kw|cv)/i);

  return {
    id: r.id,
    name,
    price: r.price || "Register to Bid",
    location: r.location || "Location Not Specified",
    image: r.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    images: r.images && r.images.length > 0 ? r.images : [r.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]],
    status,
    description,
    year,
    type,
    length,
    beam,
    hull,
    engine,
    source: r.source,
    detailUrl: r.detailUrl || "",
    auctionInfo: r.auctionInfo || "",
  };
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN PIPELINE EXPORT
// validate → deduplicate → normalize → analyze
// ────────────────────────────────────────────────────────────────────────────
export function cleanData(raw: RawVessel[]): Vessel[] {
  console.log(`\n====== DATA PIPELINE START (${raw.length} raw records) ======`);

  const step1 = validate(raw);
  const step2 = deduplicate(step1);
  const step3 = step2.map((r, i) => normalize(r, i));
  const step4 = step3.map((r, i) => analyze(r, i));

  console.log(`[PIPELINE] ✅ Final output: ${step4.length} clean vessels`);
  console.log(`====== DATA PIPELINE END ======\n`);

  return step4;
}