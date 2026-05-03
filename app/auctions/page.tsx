import Link from "next/link";
import Image from "next/image";
import { pool } from "../lib/db";
import { Vessel } from "../lib/types";
import { mockVessels } from "../lib/mockData";

export const dynamic = 'force-dynamic';

export default async function AuctionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.query?.toLowerCase() || "";
  
  let vessels = [];
  let dbError = false;
  
  try {
    if (query) {
      const { rows } = await pool.query(`
        SELECT * FROM "Vessel"
        WHERE name ILIKE $1
           OR location ILIKE $1
           OR type ILIKE $1
      `, [`%${query}%`]);
      vessels = rows;
    } else {
      const { rows } = await pool.query('SELECT * FROM "Vessel" ORDER BY id');
      vessels = rows;
    }
  } catch (err) {
    console.error("Database connection failed, using mock data fallback.");
    dbError = true;
    vessels = query 
      ? mockVessels.filter(v => 
          v.name.toLowerCase().includes(query) || 
          v.location.toLowerCase().includes(query) || 
          v.type.toLowerCase().includes(query)
        )
      : mockVessels;
  }

  return (
    <div className="px-6" style={{ maxWidth: "1280px", margin: "0 auto", width: "100%", paddingTop: "48px", paddingBottom: "120px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 className="text-4xl font-bold text-[#0f2846] mb-3">
          {query ? `Results for "${resolvedParams?.query}"` : "Active Auctions"}
        </h1>
        {dbError && vessels.length === 0 && (
          <p className="text-red-500 font-bold text-lg mb-6">
            Database connection failed. Please configure DATABASE_URL in Vercel.
          </p>
        )}
          <p className="text-gray-500 text-lg mb-6">
            {vessels.length} vessel{vessels.length !== 1 ? "s" : ""} found
          </p>
        )}
        <div style={{ width: "64px", height: "4px", backgroundColor: "#0EA5E9", marginBottom: "2rem", borderRadius: "99px" }} />

        {/* ── Search Bar ── */}
        <div style={{ display: "flex", width: "100%", justifyContent: "center", marginTop: "0.5rem", marginBottom: "3rem" }}>
          <form
            action="/auctions"
            method="GET"
            className="flex w-full bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-14"
            style={{ maxWidth: "672px" }}
            suppressHydrationWarning
          >
            <input
              type="text"
              name="query"
              defaultValue={resolvedParams?.query || ""}
              placeholder="Search by vessel name, type, or location..."
              className="flex-grow px-5 text-gray-800 outline-none placeholder-gray-400 text-base"
              suppressHydrationWarning
            />
            <button
              type="submit"
              className="bg-[#0EA5E9] hover:bg-blue-500 transition text-white font-bold px-8 text-base cursor-pointer"
              suppressHydrationWarning
            >
              🔍 Search
            </button>
          </form>
        </div>

        {query && (
          <a href="/auctions" className="inline-block mt-4 text-sm text-gray-400 hover:text-[#0EA5E9] transition">
            ✕ Clear search
          </a>
        )}
      </div>

      {vessels.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-xl">No vessels found matching your search.</p>
          <Link href="/auctions" className="mt-6 inline-block text-[#0EA5E9] font-semibold hover:underline">
            Clear search
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "32px", padding: "0 16px" }}>
          {vessels.map((vessel: Vessel) => (
            <Link
              key={vessel.id}
              href={`/vessels/${vessel.id}`}
              className="auction-card"
              style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: "380px", backgroundColor: "white", borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", overflow: "hidden", border: "1px solid #f1f5f9", transition: "transform 0.2s, box-shadow 0.2s", textDecoration: "none" }}
            >
              {/* Image Container */}
              <div style={{ position: "relative", width: "100%", height: "260px", overflow: "hidden" }}>
                <Image
                  src={vessel.image || "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800"}
                  alt={vessel.name || "Vessel"}
                  fill
                  style={{ objectFit: "cover", transition: "transform 0.7s" }}
                  unoptimized
                />
                {/* Status Badge */}
                <div style={{ position: "absolute", top: "16px", right: "16px", backgroundColor: "#0EA5E9", color: "white", fontSize: "0.75rem", fontWeight: 800, padding: "6px 14px", borderRadius: "99px", textTransform: "uppercase", letterSpacing: "0.5px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                  {vessel.status}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "28px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f2846", marginBottom: "16px", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {vessel.name}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", color: "#64748b", fontSize: "0.9rem", marginBottom: "24px", flexGrow: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.1rem" }}>📍</span>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{vessel.location || "Location unavailable"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.1rem" }}>📅</span>
                    <span>{vessel.year || "Year unknown"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.1rem" }}>⛵</span>
                    <span>{vessel.type || "Vessel"}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "20px", borderTop: "1px solid #f1f5f9" }}>
                  <span style={{ color: "#0EA5E9", fontWeight: 800, fontSize: "1.3rem" }}>{vessel.price}</span>
                  <span style={{ color: "#0f2846", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "4px" }}>
                    Details <span>→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}