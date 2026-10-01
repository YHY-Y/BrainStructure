import type { Thought } from "@/types/diary";

export type BrainBlob = Thought & {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  path: string;
};

/** 사람 옆모습과 뇌 영역은 화면 크기에 관계없이 유지되는 고정 좌표 path입니다. */
export const HEAD_PATH = "M456 531 C432 504 418 476 421 446 C424 424 446 409 463 394 C483 376 489 352 480 326 C499 295 505 255 497 213 C489 165 467 119 431 86 C391 49 337 30 277 31 C213 32 159 50 124 86 C94 116 82 153 82 194 C82 214 72 229 57 245 L28 276 C17 287 12 300 17 309 C22 318 39 315 48 319 C55 323 50 333 43 338 C38 343 40 350 50 354 C39 363 41 371 53 374 C45 386 47 398 58 404 C69 411 83 404 91 413 C99 422 91 440 98 453 C110 476 140 474 163 465 C186 456 204 464 207 486 L211 531";
export const BRAIN_PATH = "M105 192 C98 158 111 119 141 91 C174 60 221 48 263 52 C291 31 332 40 348 59 C381 45 421 63 428 88 C462 96 482 128 473 157 C497 179 498 216 478 237 C485 267 464 296 437 301 C423 326 388 337 361 323 C337 342 302 340 283 320 C254 333 221 321 211 299 C180 303 154 284 152 260 C126 253 112 227 121 208 C114 204 108 199 105 192 Z";

const ANCHORS = [
  [298, 190], [190, 126], [407, 123], [180, 244],
  [414, 247], [286, 84], [292, 294], [461, 184],
] as const;

const SLOT_LIMITS = [
  [94, 74], [61, 47], [61, 47], [59, 45],
  [59, 45], [47, 35], [48, 36], [43, 34],
] as const;

function blobPath(cx: number, cy: number, rx: number, ry: number, seed: number) {
  const points = 14;
  const coords = Array.from({ length: points }, (_, index) => {
    const angle = (Math.PI * 2 * index) / points;
    const wobble = 1 + Math.sin(seed * 1.71 + index * 2.37) * 0.075 + Math.cos(seed + index * 1.43) * 0.04;
    return [cx + Math.cos(angle) * rx * wobble, cy + Math.sin(angle) * ry * wobble] as const;
  });
  const mids = coords.map((point, index) => {
    const next = coords[(index + 1) % points];
    return [(point[0] + next[0]) / 2, (point[1] + next[1]) / 2] as const;
  });
  return `M ${mids[points - 1][0].toFixed(1)} ${mids[points - 1][1].toFixed(1)} ` + coords.map((point, index) => `Q ${point[0].toFixed(1)} ${point[1].toFixed(1)} ${mids[index][0].toFixed(1)} ${mids[index][1].toFixed(1)}`).join(" ") + " Z";
}

/** 큰 생각부터 중앙 anchor를 배정하며, 각 anchor의 안전 반경으로 겹침을 제한합니다. */
export function buildBrainBlobs(thoughts: Thought[]): BrainBlob[] {
  const sorted = thoughts.map((thought, originalIndex) => ({ thought, originalIndex })).sort((a, b) => b.thought.percentage - a.thought.percentage);
  const result = sorted.map(({ thought, originalIndex }, rank) => {
    const [cx, cy] = ANCHORS[rank];
    const [maxRx, maxRy] = SLOT_LIMITS[rank];
    const weight = Math.sqrt(Math.max(3, thought.percentage) / 100);
    const rx = Math.min(maxRx, 30 + weight * 82);
    const ry = Math.min(maxRy, 24 + weight * 63);
    return { ...thought, cx, cy, rx, ry, path: blobPath(cx, cy, rx, ry, originalIndex + rank * 11 + 1), originalIndex };
  });
  return result.sort((a, b) => a.originalIndex - b.originalIndex);
}
