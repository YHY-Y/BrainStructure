import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "오늘의 뇌구조 | Brain Diary",
    short_name: "Brain Diary",
    description: "오늘 내 머릿속을 그림으로 기록하는 비주얼 다이어리",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f6f0",
    theme_color: "#3f4540",
    lang: "ko",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
