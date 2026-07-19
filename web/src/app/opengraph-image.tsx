import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ranasi — Chrome autofill extension";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(145deg, #061012 0%, #12363a 55%, #1b4f4a 100%)",
          color: "#f4faf7",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            color: "#d4b56a",
            textTransform: "uppercase",
          }}
        >
          Chrome Extension
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4 }}>
            Ranasi
          </div>
          <div style={{ fontSize: 36, color: "#9fe0bc", maxWidth: 800 }}>
            Autofill forms in one click · AI fill · New-tab desktop
          </div>
        </div>
        <div style={{ fontSize: 24, color: "rgba(244,250,247,0.7)" }}>
          www.ranasi.com · Free to start · Pro $10/year
        </div>
      </div>
    ),
    { ...size },
  );
}
