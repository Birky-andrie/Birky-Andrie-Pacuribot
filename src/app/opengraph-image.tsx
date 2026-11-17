import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Birky Andrie L. Pacuribot — CS Engineer & Creative Technologist";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F7F7F4",
          color: "#111111",
          padding: "56px",
          border: "12px solid #111111",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid #111111",
            paddingBottom: "20px",
            fontSize: "20px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "14px",
                height: "14px",
                backgroundColor: "#D9381E",
              }}
            />
            <span style={{ fontWeight: 700 }}>BIRKY ANDRIE L. PACURIBOT</span>
          </div>
          <span style={{ color: "#52524E" }}>
            CS ENGINEER + CREATIVE TECHNOLOGIST // CDO, PH
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "58px",
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              maxWidth: "1020px",
            }}
          >
            Fast internal web systems and direct-response video assets that drive measurable revenue.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderTop: "2px solid #111111",
            paddingTop: "24px",
            gap: "48px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "40px", fontWeight: 700, color: "#D9381E" }}>
              &lt; 5s
            </span>
            <span style={{ fontSize: "16px", color: "#52524E", textTransform: "uppercase" }}>
              Audit Report Latency (Pacs Builders)
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "40px", fontWeight: 700 }}>1.00</span>
            <span style={{ fontSize: "16px", color: "#52524E", textTransform: "uppercase" }}>
              Trailblazer Startup Lab Lead
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "40px", fontWeight: 700 }}>20–40s</span>
            <span style={{ fontSize: "16px", color: "#52524E", textTransform: "uppercase" }}>
              A/B-Tested Ad Cuts (Hackerlily, DE)
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
