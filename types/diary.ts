export type Thought = {
  id: string;
  text: string;
  percentage: number;
  color: string;
  emoji?: string;
};

export type BrainDiary = {
  date: string;
  ownerName: string;
  mood?: string;
  memo: string;
  thoughts: Thought[];
};

export type SaveStatus = "idle" | "saving" | "saved";
