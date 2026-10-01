import type { BrainDiary, Thought } from "@/types/diary";

export const PALETTE = ["#F6BFC3", "#F8D98A", "#BFDDB8", "#A9D5DA", "#CFC3E8", "#F3BD9A", "#AEE1D2", "#E8D9C3"];
export const STORAGE_PREFIX = "brain-diary-";

export const formatLocalDate = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
};

export const createEmptyDiary = (date: string): BrainDiary => ({
  date,
  ownerName: "",
  mood: undefined,
  memo: "",
  thoughts: [{ id: `thought-${Date.now()}`, text: "", percentage: 100, color: PALETTE[0], emoji: "" }],
});

export const createThought = (index: number): Thought => ({
  id: `thought-${Date.now()}-${index}`,
  text: "",
  percentage: 0,
  color: PALETTE[index % PALETTE.length],
  emoji: "",
});

export const isDiary = (value: unknown): value is BrainDiary => {
  if (!value || typeof value !== "object") return false;
  const diary = value as BrainDiary;
  return typeof diary.date === "string" && typeof diary.memo === "string" && Array.isArray(diary.thoughts) && diary.thoughts.length > 0;
};

export const getStoredDiary = (date: string): BrainDiary | null => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${date}`);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isDiary(parsed)) return null;
    const thoughts = parsed.thoughts.slice(0, 8);
    let remaining = 100;
    const cappedThoughts = thoughts.map((thought) => {
      const percentage = Math.min(remaining, Math.max(0, Number(thought.percentage) || 0));
      remaining -= percentage;
      return { ...thought, percentage };
    });
    return { ...parsed, ownerName: typeof parsed.ownerName === "string" ? parsed.ownerName : "", thoughts: cappedThoughts };
  } catch {
    return null;
  }
};
