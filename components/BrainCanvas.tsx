import type { BrainDiary } from "@/types/diary";
import { BRAIN_PATH, buildBrainCells } from "@/utils/brainLayout";

type Props = { diary: BrainDiary; compact?: boolean };

export function BrainCanvas({ diary, compact = false }: Props) {
  const cells = buildBrainCells(diary.thoughts);
  return (
    <svg className="brain-svg" viewBox="0 0 520 380" role="img" aria-label="입력한 생각 비율로 구성된 오늘의 뇌구조">
      <defs>
        <clipPath id={compact ? "brain-clip-export" : "brain-clip"}><path d={BRAIN_PATH} /></clipPath>
        <filter id={compact ? "soft-shadow-export" : "soft-shadow"} x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#41372e" floodOpacity=".12" />
        </filter>
      </defs>
      <g filter={`url(#${compact ? "soft-shadow-export" : "soft-shadow"})`}>
        <g clipPath={`url(#${compact ? "brain-clip-export" : "brain-clip"})`}>
          {cells.map((cell, index) => {
            const left = cell.x - 8;
            const wave = index % 2 === 0 ? 12 : -12;
            const path = `M${left} 20 L${left + cell.width + 16} 20 L${left + cell.width + 16 + wave} 115 L${left + cell.width + 8 - wave} 205 L${left + cell.width + 16 + wave} 370 L${left} 370 Z`;
            return <path key={cell.id} d={path} fill={cell.color} stroke="#4d443e" strokeWidth="2.2" strokeLinejoin="round" />;
          })}
          <path d="M72 155 C115 119 130 177 171 141 S239 123 260 153 S320 181 354 142 S414 130 452 160 M70 233 C114 207 139 252 178 224 S239 201 271 232 S340 252 370 220 S423 212 457 239" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="4" strokeLinecap="round" />
        </g>
        <path d={BRAIN_PATH} fill="none" stroke="#3f3935" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {cells.map((cell) => {
        const small = cell.width < 68;
        const label = cell.text.trim() || "나의 생각";
        return (
          <g key={`label-${cell.id}`} transform={`translate(${Math.min(452, Math.max(68, cell.centerX))}, 193)`} className="brain-label">
            {!small && cell.emoji && <text y="-25" textAnchor="middle" fontSize="25">{cell.emoji}</text>}
            <text y={small || !cell.emoji ? -1 : 7} textAnchor="middle" fontSize={small ? "12" : "16"} fontWeight="700" fill="#302b27">{label.length > (small ? 4 : 8) ? `${label.slice(0, small ? 4 : 8)}…` : label}</text>
            {!small && <text y="30" textAnchor="middle" fontSize="13" fontWeight="600" fill="#625952">{cell.percentage}%</text>}
          </g>
        );
      })}
    </svg>
  );
}
