import { GripVertical, Trash2 } from "lucide-react";
import type { Thought } from "@/types/diary";

type Props = { thought: Thought; index: number; canDelete: boolean; onChange: (patch: Partial<Thought>) => void; onDelete: () => void };

export function ThoughtCard({ thought, index, canDelete, onChange, onDelete }: Props) {
  return (
    <article className="thought-card">
      <div className="thought-card-head">
        <div className="thought-number"><GripVertical size={16} aria-hidden="true" /><span style={{ background: thought.color }} /> 생각 {index + 1}</div>
        <button className="delete-button" onClick={onDelete} disabled={!canDelete} aria-label={`생각 ${index + 1} 삭제`}><Trash2 size={16} /> 삭제</button>
      </div>
      <div className="thought-fields">
        <label className="text-field main-field"><span>생각 이름</span><input value={thought.text} maxLength={16} onChange={(e) => onChange({ text: e.target.value })} placeholder="무슨 생각을 했나요?" /></label>
        <label className="text-field emoji-field"><span>이모지</span><input value={thought.emoji ?? ""} maxLength={4} onChange={(e) => onChange({ emoji: e.target.value })} placeholder="✨" aria-label="이모지" /></label>
        <label className="color-field"><span>색상</span><span className="color-control" style={{ background: thought.color }}><input type="color" value={thought.color} onChange={(e) => onChange({ color: e.target.value })} aria-label="영역 색상" /></span></label>
      </div>
      <div className="percentage-row">
        <label htmlFor={`range-${thought.id}`}>머릿속 비중</label>
        <div className="percent-input"><input type="number" min="0" max="100" value={thought.percentage} onChange={(e) => onChange({ percentage: Math.min(100, Math.max(0, Number(e.target.value))) })} aria-label="생각 비율" /><span>%</span></div>
      </div>
      <input id={`range-${thought.id}`} className="range" type="range" min="0" max="100" value={thought.percentage} onChange={(e) => onChange({ percentage: Number(e.target.value) })} style={{ "--range-color": thought.color } as React.CSSProperties} />
    </article>
  );
}
