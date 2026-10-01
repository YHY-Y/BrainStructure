import type { Thought } from "@/types/diary";

export type BrainCell = Thought & { x: number; width: number; centerX: number };

export function buildBrainCells(thoughts: Thought[]): BrainCell[] {
  const weights = thoughts.map((item) => Math.max(item.percentage, 4));
  const sum = weights.reduce((total, value) => total + value, 0);
  let cursor = 30;
  return thoughts.map((thought, index) => {
    const width = (weights[index] / sum) * 440;
    const cell = { ...thought, x: cursor, width, centerX: cursor + width / 2 };
    cursor += width;
    return cell;
  });
}

export const BRAIN_PATH = "M82 278 C42 251 36 207 55 177 C34 132 72 92 113 91 C132 46 184 32 222 51 C253 21 307 27 330 58 C372 39 423 60 430 99 C473 108 492 153 470 187 C493 224 471 270 435 282 C414 326 365 343 326 324 C293 353 244 347 218 326 C179 347 132 332 117 302 C102 301 91 291 82 278 Z";
