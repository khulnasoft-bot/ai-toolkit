import { ImageResponse } from "next/og";

export const alt = "AiDocs documentation platform";
export const contentType = "image/png";
export const size = {
  height: 630,
  width: 1200,
};

const OpenGraphImage = () =>
  new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#000",
        color: "#fff",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 920,
        }}
      >
        <div style={{ fontSize: 76, fontWeight: 600 }}>AiDocs</div>
        <div style={{ color: "#a1a1a1", fontSize: 36, lineHeight: 1.25 }}>
          Package-backed documentation sites for people and agents
        </div>
      </div>
    </div>,
    size
  );

export default OpenGraphImage;
