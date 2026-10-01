"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Plus, RotateCcw, Save, Sparkles, Trash2 } from "lucide-react";
import { BrainCanvas } from "@/components/BrainCanvas";
import { DateSelector } from "@/components/DateSelector";
import { ExportCard } from "@/components/ExportCard";
import { MoodSelector } from "@/components/MoodSelector";
import { ThoughtCard } from "@/components/ThoughtCard";
import { useBrainDiary } from "@/hooks/useBrainDiary";

export default function Home() {
  const { diary, hydrated, saveStatus, lastSaved, changeDate, updateThought, addThought, removeThought, updateMeta, copyYesterday, clearAll } = useBrainDiary();
  const exportRef = useRef<HTMLDivElement>(null);
  const [notice, setNotice] = useState("");
  const [exporting, setExporting] = useState(false);
  const total = diary.thoughts.reduce((sum, thought) => sum + thought.percentage, 0);
  const isValid = total === 100;

  const handleCopyYesterday = () => {
    if (copyYesterday()) setNotice("어제 기록을 불러왔어요."); else setNotice("어제 저장한 기록이 없어요.");
    window.setTimeout(() => setNotice(""), 2600);
  };

  const handleExport = async () => {
    if (!isValid || !exportRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(exportRef.current, { width: 1080, height: 1350, pixelRatio: 1, cacheBust: true, backgroundColor: "#f7f3ea" });
      const link = document.createElement("a");
      link.download = `brain-diary-${diary.date}.png`; link.href = dataUrl; link.click();
    } finally { setExporting(false); }
  };

  if (!hydrated) return <main className="loading">오늘의 마음을 펼치는 중…</main>;

  return (
    <main>
      <header className="site-header">
        <a className="logo" href="#top" aria-label="Brain Diary 홈"><span className="brand-mark">B</span><span><strong>Brain Diary</strong><small>오늘의 뇌구조</small></span></a>
        <div className="header-actions"><span className={`save-status ${saveStatus}`}><i />{saveStatus === "saving" ? "저장 중…" : saveStatus === "saved" ? `${lastSaved} 저장됨` : "자동 저장"}</span><button className="today-button" onClick={() => changeDate(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10))}>오늘로</button></div>
      </header>

      <div id="top" className="page-shell">
        <section className="intro">
          <div><span className="eyebrow"><Sparkles size={14} /> MY BRAIN, TODAY</span><h1>오늘, 어떤 생각이<br /><em>머릿속을 채웠나요?</em></h1><p>흘러가는 생각을 색과 모양으로 남겨보세요.<br />하루 3분이면 충분한 나만의 시각적 일기예요.</p></div>
          <DateSelector date={diary.date} onChange={changeDate} />
        </section>

        <div className="workspace">
          <section className="preview-panel">
            <div className="panel-label"><span>LIVE PREVIEW</span><i>입력과 동시에 바뀌어요</i></div>
            <div className="brain-frame"><div className="paper-tape" /><BrainCanvas diary={diary} /><p className="brain-caption">{diary.memo || "오늘 머릿속에서 가장 큰 자리를 차지한 것은 무엇인가요?"}</p><span className="doodle doodle-one">✦</span><span className="doodle doodle-two">⌁</span></div>
            <div className={`total-card ${isValid ? "valid" : "invalid"}`}>
              <div><span>생각 비율 합계</span><strong>{total}<small>%</small></strong></div>
              <div className="total-bar"><span style={{ width: `${Math.min(total, 100)}%` }} /></div>
              <p>{isValid ? "딱 맞아요! 이제 이미지로 저장할 수 있어요." : `100%까지 ${Math.abs(100 - total)}% ${total < 100 ? "남았어요" : "초과했어요"}. 비율을 조정해주세요.`}</p>
            </div>
            <button className="yesterday-button" onClick={handleCopyYesterday}><RotateCcw size={16} /> 어제 기록에서 시작</button>
          </section>

          <section className="editor-panel">
            <div className="section-heading"><div><span className="eyebrow">WHAT&apos;S ON YOUR MIND?</span><h2>머릿속 생각들</h2></div><span className="count">{diary.thoughts.length} / 10</span></div>
            <p className="section-description">각 생각이 차지하는 비중을 정해보세요. 합계가 100%가 되면 완성!</p>
            <div className="thought-list">{diary.thoughts.map((thought, index) => <ThoughtCard key={thought.id} thought={thought} index={index} canDelete={diary.thoughts.length > 1} onChange={(patch) => updateThought(thought.id, patch)} onDelete={() => removeThought(thought.id)} />)}</div>
            <button className="add-button" onClick={addThought} disabled={diary.thoughts.length >= 10}><Plus size={18} /> 생각 하나 더 추가하기</button>
          </section>
        </div>

        <div className="lower-grid">
          <MoodSelector value={diary.mood} onChange={(mood) => updateMeta({ mood })} />
          <section className="memo-section"><div className="section-heading"><div><span className="eyebrow">A NOTE TO MYSELF</span><h2>오늘의 한마디</h2></div><span className="optional">{diary.memo.length} / 200</span></div><label><textarea maxLength={200} value={diary.memo} onChange={(e) => updateMeta({ memo: e.target.value })} placeholder="오늘 머릿속을 한 문장으로 기록해보세요." /><span>✎</span></label></section>
        </div>

        <section className="finish-card"><div><span className="eyebrow">YOUR DAY, CAPTURED</span><h2>오늘의 마음을 한 장으로 간직하세요</h2><p>기록은 자동으로 이 브라우저에 저장돼요.</p></div><div className="finish-actions"><button className="secondary-button" onClick={() => setNotice("기록이 안전하게 저장되었어요.")}><Save size={18} /> 기록 저장</button><button className="download-button" disabled={!isValid || exporting} onClick={handleExport}><Download size={18} /> {exporting ? "이미지 만드는 중…" : "PNG 이미지로 저장"}</button></div></section>
        <footer><div><span className="brand-mark small">B</span><strong>Brain Diary</strong><span>오늘의 마음을, 한 장의 그림으로.</span></div><button onClick={() => { if (window.confirm("모든 기록을 삭제하시겠습니까?\n삭제된 기록은 복구할 수 없습니다.")) clearAll(); }}><Trash2 size={14} /> 모든 기록 삭제</button></footer>
      </div>
      {notice && <div className="toast">{notice}</div>}
      <div className="export-stage"><ExportCard ref={exportRef} diary={diary} /></div>
    </main>
  );
}
