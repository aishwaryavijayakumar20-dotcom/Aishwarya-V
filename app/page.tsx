// Triggering Vercel rebuild after directory structure fix
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="w-full">

      {/* ── Hero ── */}
      <div
        className="w-full flex flex-col items-center justify-center text-center text-white"
        style={{
          minHeight: "520px",
          backgroundImage:
            "linear-gradient(rgba(11,37,69,0.6), rgba(11,37,69,0.75)), url('https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div style={{ maxWidth: "720px", padding: "0 24px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.2, marginBottom: "1.25rem", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
            Find Your Dream Vessel
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#dbeafe", marginBottom: "2.5rem", maxWidth: "500px", lineHeight: 1.7 }}>
            The premier platform for buying and selling luxury yachts, sailboats, and commercial marine craft.
          </p>
          <form
            action="/auctions"
            method="GET"
            style={{ display: "flex", width: "100%", maxWidth: "560px", borderRadius: "10px", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.4)", height: "52px", backgroundColor: "#ffffff" }}
            suppressHydrationWarning
          >
            <input
              type="text"
              name="query"
              placeholder="Search by name, make, or location..."
              style={{ flex: 1, padding: "0 20px", fontSize: "0.95rem", border: "none", outline: "none", color: "#111827", backgroundColor: "#ffffff", caretColor: "#0EA5E9" }}
              suppressHydrationWarning
            />
            <button
              type="submit"
              style={{ background: "#0EA5E9", color: "white", fontWeight: 700, padding: "0 28px", border: "none", cursor: "pointer", fontSize: "0.95rem", whiteSpace: "nowrap" }}
              suppressHydrationWarning
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* ── Welcome / Overview ── */}
      <section style={{ background: "white", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#0f2846", marginBottom: "16px" }}>
            Welcome to Marine Auctions
          </h2>
          <div style={{ width: "64px", height: "4px", background: "#0EA5E9", margin: "0 auto 40px auto", borderRadius: "99px" }} />
          <p style={{ fontSize: "1.05rem", color: "#4a5568", lineHeight: 1.85, marginBottom: "20px" }}>
            Marine Auctions is your premier global destination for discovering, bidding on, and acquiring luxury yachts,
            sport fishing vessels, commercial crafts, and high-performance speedboats. We aggregate listings directly
            from the world&apos;s most trusted marine auction houses and present them in a clean, searchable interface designed
            for both experienced buyers and first-time bidders.
          </p>
          <p style={{ fontSize: "1.05rem", color: "#4a5568", lineHeight: 1.85, marginBottom: "20px" }}>
            Every vessel on our platform undergoes a thorough data verification and cleaning process before it is published.
            We extract rich details — including vessel name, year of manufacture, hull type, location, and auction status —
            to give you a complete picture before you commit to any bid.
          </p>
          <p style={{ fontSize: "1.05rem", color: "#4a5568", lineHeight: 1.85 }}>
            Whether you&apos;re searching for an unreserved bargain or a premium cruiser at auction, Marine Auctions provides
            a transparent, fast, and reliable browsing experience. Our mission is to connect serious buyers with authentic
            vessels, eliminating guesswork and putting the best of the marine market at your fingertips.
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ background: "#f8f9fa", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#0f2846", marginBottom: "56px" }}>
            Why Choose Marine Auctions?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "24px" }}>
            {[
              { icon: "🚢", title: "Curated Vessel Listings", desc: "Listings are carefully scraped, cleaned, and categorised from leading marine auction houses." },
              { icon: "🔍", title: "Powerful Smart Search", desc: "Filter vessels instantly by name, location, or vessel type in real-time." },
              { icon: "📋", title: "Complete Vessel Profiles", desc: "Year, hull type, location, auction status, and full description on every listing." },
              { icon: "🌏", title: "Global Coverage", desc: "Vessels sourced from auction houses across Australia, Europe, and beyond." },
              { icon: "⚡", title: "Real-Time Updates", desc: "Our platform fetches fresh vessel data automatically on every page load." },
              { icon: "🔒", title: "Trusted & Transparent", desc: "Every listing shows its original auction details so you can bid with confidence." },
            ].map((f) => (
              <div
                key={f.title}
                style={{ background: "white", borderRadius: "16px", padding: "36px 28px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", textAlign: "center" }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "16px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f2846", marginBottom: "10px" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#718096", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: "white", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f2846", marginBottom: "16px" }}>
            Ready to Find Your Vessel?
          </h2>
          <p style={{ color: "#718096", fontSize: "1.05rem", marginBottom: "36px", lineHeight: 1.7 }}>
            Browse live listings from top marine auction houses. Use our smart search to find your perfect vessel and place your bid today.
          </p>
          <Link
            href="/auctions"
            style={{ background: "#0EA5E9", color: "white", fontWeight: 700, padding: "16px 48px", borderRadius: "12px", fontSize: "1.05rem", textDecoration: "none", display: "inline-block", boxShadow: "0 4px 16px rgba(14,165,233,0.35)", transition: "background 0.2s" }}
          >
            Browse Auctions →
          </Link>
        </div>
      </section>

    </div>
  );
}