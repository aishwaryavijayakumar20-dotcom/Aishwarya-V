import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { pool } from "../../lib/db";
import { Vessel } from "../../lib/types";

export const dynamic = 'force-dynamic';

export default async function VesselDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  
  const { rows } = await pool.query('SELECT * FROM "Vessel" WHERE id = $1', [params.id]);
  const vessel = rows[0] as Vessel;
  if (!vessel) return notFound();

  const hasLocalImage = vessel.image?.startsWith("/vessels/");

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px", fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Back */}
      <Link href="/auctions" style={{ color: "#0f2846", fontWeight: 600, textDecoration: "none", fontSize: "0.9rem" }}>
        ← Back to Auctions
      </Link>

      {/* Status + Title */}
      <div style={{ textAlign: "center", margin: "24px 0 20px" }}>
        <span style={{ background: "#0EA5E9", color: "white", fontSize: "0.8rem", fontWeight: 700, padding: "4px 14px", borderRadius: "99px" }}>
          {vessel.status}
        </span>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f2846", margin: "14px 0 4px", lineHeight: 1.3 }}>
          {vessel.name}
        </h1>
        <p style={{ color: "#0EA5E9", fontWeight: 700, fontSize: "1.25rem", margin: 0 }}>{vessel.price}</p>
      </div>

      {/* Image Gallery */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
        <div style={{ position: "relative", width: "100%", height: "420px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
          {hasLocalImage ? (
            <img src={vessel.images?.[0] || vessel.image} alt={vessel.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Image src={vessel.images?.[0] || vessel.image || "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800"} alt={vessel.name} fill style={{ objectFit: "cover" }} unoptimized />
          )}
        </div>
        
        {vessel.images && vessel.images.length > 1 && (
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
            {vessel.images.slice(1).map((img, idx) => (
              <div key={idx} style={{ position: "relative", minWidth: "120px", height: "80px", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                {hasLocalImage ? (
                  <img src={img} alt={`${vessel.name} thumbnail`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <Image src={img} alt={`${vessel.name} thumbnail`} fill style={{ objectFit: "cover" }} unoptimized />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "28px" }}>
        {[
          { icon: "📍", label: "Location", value: vessel.location || "—" },
          { icon: "📅", label: "Year",     value: vessel.year    || "N/A" },
          { icon: "⛵", label: "Type",     value: vessel.type    || "Vessel" },
          { icon: "📏", label: "Length",   value: vessel.length  },
          { icon: "↔️", label: "Beam",     value: vessel.beam    },
          { icon: "🛡️", label: "Hull",     value: vessel.hull    },
          { icon: "⚙️", label: "Engine",   value: vessel.engine  },
          { icon: "🌐", label: "Source",   value: vessel.source  || "—" },
        ].filter(item => item.value).map(item => (
          <div key={item.label} style={{ background: "#f8f9fa", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "1.5rem" }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: "0.7rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f2846" }}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Auction Info */}
      {vessel.auctionInfo && (
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "16px 20px", marginBottom: "24px" }}>
          <div style={{ fontWeight: 700, color: "#1d4ed8", marginBottom: "4px", fontSize: "0.85rem" }}>📢 AUCTION DETAILS</div>
          <div style={{ color: "#1e3a5f", fontSize: "0.9rem" }}>{vessel.auctionInfo}</div>
        </div>
      )}

      {/* Description */}
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "28px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f2846", marginBottom: "12px" }}>About This Vessel</h2>
        <p style={{ color: "#4a5568", lineHeight: 1.8, fontSize: "0.95rem", margin: 0 }}>{vessel.description}</p>
      </div>

      {/* CTA */}
      <div style={{ background: "#0f2846", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
        <h3 style={{ color: "white", fontSize: "1.3rem", fontWeight: 800, marginBottom: "8px" }}>Interested in This Vessel?</h3>
        <p style={{ color: "#93c5fd", fontSize: "0.875rem", marginBottom: "24px" }}>Place your bid on the original auction platform.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/auctions" style={{ background: "white", color: "#0f2846", fontWeight: 700, padding: "12px 28px", borderRadius: "10px", textDecoration: "none" }}>
            ← Browse More
          </Link>
          {vessel.detailUrl && (
            <a href={vessel.detailUrl} target="_blank" rel="noopener noreferrer"
              style={{ background: "#0EA5E9", color: "white", fontWeight: 700, padding: "12px 28px", borderRadius: "10px", textDecoration: "none" }}>
              View Original Listing →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}