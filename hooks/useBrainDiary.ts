"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BrainDiary, SaveStatus, Thought } from "@/types/diary";
import { createEmptyDiary, createThought, formatLocalDate, getStoredDiary, STORAGE_PREFIX } from "@/utils/diary";

export function useBrainDiary() {
  const [diary, setDiary] = useState<BrainDiary>(() => createEmptyDiary(formatLocalDate(new Date())));
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState("");
  const skipSave = useRef(true);

  useEffect(() => {
    const today = formatLocalDate(new Date());
    setDiary(getStoredDiary(today) ?? createEmptyDiary(today));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || skipSave.current) {
      skipSave.current = false;
      return;
    }
    setSaveStatus("saving");
    const timer = window.setTimeout(() => {
      localStorage.setItem(`${STORAGE_PREFIX}${diary.date}`, JSON.stringify(diary));
      setSaveStatus("saved");
      setLastSaved(new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()));
    }, 400);
    return () => window.clearTimeout(timer);
  }, [diary, hydrated]);

  const changeDate = useCallback((date: string) => {
    skipSave.current = true;
    setDiary(getStoredDiary(date) ?? createEmptyDiary(date));
    setSaveStatus("idle");
    setLastSaved("");
  }, []);

  const updateThought = useCallback((id: string, patch: Partial<Thought>) => {
    setDiary((current) => ({ ...current, thoughts: current.thoughts.map((item) => item.id === id ? { ...item, ...patch } : item) }));
  }, []);

  const addThought = useCallback(() => {
    setDiary((current) => current.thoughts.length >= 8 ? current : ({ ...current, thoughts: [...current.thoughts, createThought(current.thoughts.length)] }));
  }, []);

  const removeThought = useCallback((id: string) => {
    setDiary((current) => current.thoughts.length <= 1 ? current : ({ ...current, thoughts: current.thoughts.filter((item) => item.id !== id) }));
  }, []);

  const updateMeta = useCallback((patch: Partial<Pick<BrainDiary, "ownerName" | "mood" | "memo">>) => {
    setDiary((current) => ({ ...current, ...patch }));
  }, []);

  const copyYesterday = useCallback(() => {
    const previous = new Date(`${diary.date}T12:00:00`);
    previous.setDate(previous.getDate() - 1);
    const yesterday = getStoredDiary(formatLocalDate(previous));
    if (!yesterday) return false;
    setDiary((current) => ({ ...yesterday, date: current.date, thoughts: yesterday.thoughts.map((item, index) => ({ ...item, id: `thought-${Date.now()}-${index}` })) }));
    return true;
  }, [diary.date]);

  const clearAll = useCallback(() => {
    Object.keys(localStorage).filter((key) => key.startsWith(STORAGE_PREFIX)).forEach((key) => localStorage.removeItem(key));
    skipSave.current = true;
    setDiary(createEmptyDiary(diary.date));
    setSaveStatus("idle");
    setLastSaved("");
  }, [diary.date]);

  return { diary, hydrated, saveStatus, lastSaved, changeDate, updateThought, addThought, removeThought, updateMeta, copyYesterday, clearAll };
}
