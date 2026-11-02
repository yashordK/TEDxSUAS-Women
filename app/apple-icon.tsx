import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050304",
          fontWeight: 900,
        }}
      >
        <div style={{ display: "flex", color: "#eb0028", fontSize: 64, letterSpacing: -1, WebkitTextStroke: "4px #eb0028" }}>
          TED<span style={{ fontSize: 46, marginTop: -14 }}>x</span>
        </div>
        <div style={{ color: "#ffffff", fontSize: 26, letterSpacing: 1, marginTop: -2, WebkitTextStroke: "0.8px #ffffff" }}>SUAS Women</div>
      </div>
    ),
    size,
  );
}
