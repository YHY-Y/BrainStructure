const MOODS = [
  { emoji: "😀", label: "매우 좋음" }, { emoji: "🙂", label: "좋음" }, { emoji: "😐", label: "보통" }, { emoji: "😔", label: "우울함" }, { emoji: "😡", label: "화남" },
];

type Props = { value?: string; onChange: (value?: string) => void };

export function MoodSelector({ value, onChange }: Props) {
  return (
    <section className="mood-section">
      <div className="section-heading"><div><span className="eyebrow">TODAY&apos;S MOOD</span><h2>오늘의 기분</h2></div><span className="optional">선택사항</span></div>
      <div className="mood-list">
        {MOODS.map((mood) => <button key={mood.emoji} className={`mood-button ${value === mood.emoji ? "selected" : ""}`} onClick={() => onChange(value === mood.emoji ? undefined : mood.emoji)} aria-pressed={value === mood.emoji}><span>{mood.emoji}</span><small>{mood.label}</small></button>)}
      </div>
    </section>
  );
}
