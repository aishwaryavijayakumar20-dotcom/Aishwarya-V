export default function ContactPage() {
  return (
    <div style={{ width: "100%", backgroundColor: "#f8f9fa", padding: "80px 24px", minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* Header Section */}
      <div style={{ maxWidth: "800px", textAlign: "center", marginBottom: "48px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0f2846", marginBottom: "16px" }}>Contact Us</h1>
        <div style={{ width: "64px", height: "4px", backgroundColor: "#0EA5E9", margin: "0 auto 32px", borderRadius: "99px" }} />
        <p style={{ color: "#4a5568", fontSize: "1.125rem", lineHeight: 1.8, maxWidth: "600px", margin: "0 auto" }}>
          Have a question about a listing or want to know more about our platform? Reach out and our team will get back to you shortly.
        </p>
      </div>

      {/* Main Container */}
      <div style={{ width: "100%", maxWidth: "700px" }}>
        
        {/* Contact Form */}
        <form style={{ backgroundColor: "white", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9", padding: "40px", marginBottom: "48px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f2846", textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                style={{ width: "100%", border: "2px solid #e2e8f0", backgroundColor: "#f8fafc", borderRadius: "12px", padding: "16px", outline: "none", color: "#1e293b", fontSize: "1rem", transition: "border-color 0.2s" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f2846", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                style={{ width: "100%", border: "2px solid #e2e8f0", backgroundColor: "#f8fafc", borderRadius: "12px", padding: "16px", outline: "none", color: "#1e293b", fontSize: "1rem", transition: "border-color 0.2s" }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 800, color: "#0f2846", textTransform: "uppercase", letterSpacing: "0.5px" }}>Message</label>
              <textarea
                rows={5}
                placeholder="How can we help you?"
                style={{ width: "100%", border: "2px solid #e2e8f0", backgroundColor: "#f8fafc", borderRadius: "12px", padding: "16px", outline: "none", color: "#1e293b", fontSize: "1rem", transition: "border-color 0.2s", resize: "none" }}
              />
            </div>

            <button
              type="submit"
              style={{ width: "100%", backgroundColor: "#0EA5E9", color: "white", fontWeight: 800, fontSize: "1.1rem", padding: "18px", borderRadius: "12px", border: "none", cursor: "pointer", marginTop: "8px", boxShadow: "0 4px 14px rgba(14,165,233,0.4)" }}
            >
              Send Message
            </button>

          </div>
        </form>

        {/* Contact Info Cards */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px" }}>
          {[
            { icon: "📧", label: "Email", value: "info@marineauctions.com" },
            { icon: "📞", label: "Phone", value: "+61 7 3268 3614" },
            { icon: "📍", label: "Location", value: "Brisbane, Australia" },
          ].map((c) => (
            <div key={c.label} style={{ flex: "1 1 200px", minWidth: "200px", backgroundColor: "white", borderRadius: "20px", padding: "32px 24px", textAlign: "center", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "16px" }}>{c.icon}</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f2846", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{c.label}</div>
              <div style={{ color: "#64748b", fontSize: "0.95rem" }}>{c.value}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
