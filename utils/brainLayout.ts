import type { Thought } from "@/types/diary";

export type BrainBlob = Thought & {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  path: string;
};

/** 사람 옆모습과 뇌 영역은 화면 크기에 관계없이 유지되는 고정 좌표 path입니다. */
export const HEAD_PATH = "M200 410 C197 398 194 384 193 372 C192 361 185 357 174 358 C156 361 140 366 127 359 C114 352 110 340 112 326 C113 317 112 311 105 307 C99 303 99 296 106 290 C98 286 97 279 104 273 C97 270 96 263 101 258 C94 256 82 255 80 248 C77 240 87 228 98 215 L108 203 C116 194 118 187 115 177 C107 148 115 119 132 94 C158 57 199 35 244 30 C289 25 335 36 371 61 C408 87 430 126 434 169 C439 215 422 258 391 289 C380 300 365 311 354 323 C342 336 341 348 346 361 C349 368 353 374 358 379";
export const FACE_DETAIL_PATH = "M168 192 C171 187 177 185 181 188 C184 191 181 196 177 196 C173 196 172 192 175 190 M181 188 C178 200 184 207 184 215 C184 221 180 225 175 226";
export const BRAIN_PATH = "M121 176 C112 147 121 118 141 92 C166 61 205 45 245 42 C276 30 310 34 334 49 C367 43 399 63 407 89 C429 108 438 139 433 169 C440 200 429 233 408 254 C400 280 375 300 349 298 C327 311 296 309 279 292 C252 302 224 292 214 271 C186 275 162 259 158 238 C134 231 121 213 126 194 C121 189 119 182 121 176 Z";

const ANCHORS = [
  [282, 174], [190, 111], [369, 108], [181, 207],
  [381, 207], [276, 72], [279, 260], [420, 163],
] as const;

const SLOT_LIMITS = [
  [88, 61], [59, 39], [59, 39], [56, 37],
  [56, 37], [45, 29], [46, 30], [40, 28],
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
    const ry = Math.min(maxRy, 20 + weight * 52);
    return { ...thought, cx, cy, rx, ry, path: blobPath(cx, cy, rx, ry, originalIndex + rank * 11 + 1), originalIndex };
  });
  return result.sort((a, b) => a.originalIndex - b.originalIndex);
}
