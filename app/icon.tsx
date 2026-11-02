import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050304",
          borderRadius: 12,
          color: "#eb0028",
          fontSize: 25,
          fontWeight: 900,
          letterSpacing: -1,
          WebkitTextStroke: "1.6px #eb0028",
        }}
      >
        TED<span style={{ fontSize: 19, marginTop: -6 }}>x</span>
      </div>
    ),
    size,
  );
}
