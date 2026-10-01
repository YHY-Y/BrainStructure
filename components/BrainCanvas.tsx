"use client";

import { useId, useLayoutEffect, useRef } from "react";
import type { BrainDiary } from "@/types/diary";
import { BRAIN_PATH, FACE_DETAIL_PATH, HEAD_PATH, buildBrainBlobs } from "@/utils/brainLayout";

type Props = { diary: BrainDiary; compact?: boolean };

function splitLabel(label: string) {
  if (label.length <= 6) return [label];
  const space = label.lastIndexOf(" ", Math.ceil(label.length / 2));
  const pivot = space > 1 ? space : Math.ceil(label.length / 2);
  return [label.slice(0, pivot).trim(), label.slice(space > 1 ? pivot + 1 : pivot).trim()];
}

export function BrainCanvas({ diary, compact = false }: Props) {
  const blobs = buildBrainBlobs(diary.thoughts.slice(0, 8));
  const clipId = `brain-${useId().replaceAll(":", "")}`;
  const textRefs = useRef(new Map<string, SVGTextElement>());

  useLayoutEffect(() => {
    blobs.forEach((blob) => {
      const text = textRefs.current.get(blob.id);
      if (!text) return;
      const maxWidth = blob.rx * 1.42;
      const maxHeight = blob.ry * 1.25;
      let size = Math.min(19, Math.max(10, blob.rx * 0.24));
      text.setAttribute("font-size", String(size));
      // 실제 SVG glyph 크기를 측정하고 blob의 안전 영역 안에 들 때까지 축소합니다.
      while (size > 8) {
        const box = text.getBBox();
        if (box.width <= maxWidth && box.height <= maxHeight) break;
        size -= 1;
        text.setAttribute("font-size", String(size));
      }
    });
  }, [blobs]);

  return (
    <svg className="brain-svg brain-profile" viewBox="0 0 520 430" role="img" aria-label="사람 옆모습의 뇌 영역에 배치된 오늘의 생각">
      <defs><clipPath id={clipId}><path d={BRAIN_PATH} /></clipPath></defs><g transform="translate(-26 -21.5) scale(1.1)">
      <path d={HEAD_PATH} className="head-outline" fill="none" stroke="#62798a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={FACE_DETAIL_PATH} fill="none" stroke="#62798a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d={BRAIN_PATH} className="brain-paper" fill="#fffdf7" stroke="none" />
      <g clipPath={`url(#${clipId})`}>
        {blobs.map((blob) => (
          <g key={blob.id}>
            <path d={blob.path} className="blob-gap" fill="none" stroke="#fffdf7" strokeWidth="8" strokeLinejoin="round" />
            <path d={blob.path} fill={blob.color} stroke="#62798a" strokeWidth="2.4" strokeLinejoin="round" className="thought-blob" />
          </g>
        ))}
      </g>
      <path d={BRAIN_PATH} className="brain-outline" fill="none" stroke="#62798a" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      {blobs.map((blob) => {
        const label = blob.text.trim() || "나의 생각";
        const lines = splitLabel(label);
        return (
          <g key={`label-${blob.id}`} transform={`translate(${blob.cx} ${blob.cy})`} className="brain-label" pointerEvents="none">
            {blob.emoji && <text className="blob-emoji" y={lines.length > 1 ? -25 : -21} textAnchor="middle" fontSize={blob.ry < 40 ? 14 : 21}>{blob.emoji}</text>}
            <text ref={(node) => { if (node) textRefs.current.set(blob.id, node); else textRefs.current.delete(blob.id); }} className="blob-keyword" textAnchor="middle" dominantBaseline="middle" fontSize="16">
              {lines.map((line, index) => <tspan key={line + index} x="0" dy={index === 0 ? (lines.length > 1 ? "-0.48em" : "0") : "1.05em"}>{line}</tspan>)}
            </text>
            <text className="blob-percent" y={lines.length > 1 ? 29 : 23} textAnchor="middle">{blob.percentage}%</text>
          </g>
        );
      })}
      {!compact && <text x="330" y="395" className="profile-note">오늘 내 머릿속</text>}
    </svg>
  );
}
