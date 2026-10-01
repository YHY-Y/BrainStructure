import { forwardRef } from "react";
import type { BrainDiary } from "@/types/diary";
import { BrainCanvas } from "./BrainCanvas";

export const ExportCard = forwardRef<HTMLDivElement, { diary: BrainDiary }>(function ExportCard({ diary }, ref) {
  const date = diary.date.replaceAll("-", ".");
  return (
    <div ref={ref} className="export-card" aria-hidden="true">
      <div className="export-brand"><span className="brand-mark">B</span><span>Brain Diary</span></div>
      <p className="export-date">{date}</p><h2>오늘의 뇌구조</h2><p className="export-subtitle">오늘 내 마음을 차지한 생각들</p>
      <BrainCanvas diary={diary} compact />
      <div className="export-note"><span>{diary.mood || "☁️"}</span><p>{diary.memo || "오늘 머릿속을 한 문장으로 기록해보세요."}</p></div>
      <p className="export-footer">오늘의 마음을, 한 장의 그림으로.</p>
    </div>
  );
});
