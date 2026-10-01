import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = { date: string; onChange: (date: string) => void };

export function DateSelector({ date, onChange }: Props) {
  const move = (amount: number) => {
    const next = new Date(`${date}T12:00:00`);
    next.setDate(next.getDate() + amount);
    onChange(next.toISOString().slice(0, 10));
  };
  const formatted = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" }).format(new Date(`${date}T12:00:00`));
  return (
    <div className="date-selector">
      <button className="icon-button" onClick={() => move(-1)} aria-label="이전 날짜"><ChevronLeft size={19} /></button>
      <label className="date-label">
        <span suppressHydrationWarning>{formatted}</span>
        <input type="date" value={date} onChange={(event) => onChange(event.target.value)} aria-label="기록 날짜 선택" />
      </label>
      <button className="icon-button" onClick={() => move(1)} aria-label="다음 날짜"><ChevronRight size={19} /></button>
    </div>
  );
}
