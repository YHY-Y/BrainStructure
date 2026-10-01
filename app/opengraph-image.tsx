import { ImageResponse } from "next/og";

export const alt = "오늘의 뇌구조 Brain Diary - 오늘의 생각을 그림으로 기록하세요";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f4efe5", color: "#302d29", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 42 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#302d29", color: "white", fontSize: 43 }}>B</div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>Brain Diary</div>
        </div>
        <div style={{ fontSize: 70, fontWeight: 700, letterSpacing: -4 }}>오늘의 뇌구조</div>
        <div style={{ marginTop: 24, fontSize: 28, color: "#70685f" }}>오늘 내 머릿속을 한 장의 그림으로 기록하세요</div>
        <div style={{ display: "flex", gap: 18, marginTop: 55 }}>
          {["#f6bfc3", "#f8d98a", "#bfdDB8", "#a9d5da", "#cfc3e8"].map((color, index) => <div key={color} style={{ width: 78 + index * 8, height: 68 + index * 5, borderRadius: "48% 52% 46% 54%", background: color, border: "3px solid #62798a" }} />)}
        </div>
      </div>
    </div>,
    size,
  );
}
