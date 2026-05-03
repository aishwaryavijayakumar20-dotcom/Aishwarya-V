import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Marine Auctions | Find Your Dream Vessel",
  description: "Live vessel auction platform sourcing data from top marine auction houses worldwide.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning style={{ background: "#f8f9fa", color: "#1a202c", display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>

        {/* NAVBAR */}
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", background: "#0f2846", color: "white", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "1.5rem" }}>⚓</span>
            <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "white" }}>Marine</span>
            <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "#0EA5E9" }}>Auctions</span>
          </div>
          <div style={{ display: "flex", gap: "32px", fontSize: "0.95rem" }}>
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/auctions" className="nav-link">Auctions</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1 }}>{children}</main>

        {/* FOOTER */}
        <footer style={{ background: "#0f2846", color: "white", textAlign: "center" }}>
          <div style={{ maxWidth: "500px", margin: "0 auto", padding: "48px 24px 32px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>⚓</div>
            <h4 style={{ fontSize: "1.3rem", fontWeight: 800, color: "white", marginBottom: "8px" }}>Get In Touch</h4>
            <p style={{ color: "#93c5fd", fontSize: "0.875rem", marginBottom: "24px" }}>
              Have questions about a listing? We are here to help.
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#bfdbfe" }}>
              <span>📧 info@marineauctions.com</span>
              <span>📞 +61 7 3268 3614</span>
              <span>📍 Brisbane, Australia</span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1e3a5f", padding: "14px", color: "#60a5fa", fontSize: "0.8rem" }}>
            © {new Date().getFullYear()} Marine Auctions. All Rights Reserved.
          </div>
        </footer>

      </body>
    </html>
  );
}