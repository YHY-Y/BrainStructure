import type { Thought } from "@/types/diary";

export type BrainBlob = Thought & {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  path: string;
};

/** 사람 옆모습과 뇌 영역은 화면 크기에 관계없이 유지되는 고정 좌표 path입니다. */
export const HEAD_PATH = "M201 418 C198 404 195 389 194 375 C193 363 185 359 173 361 C154 365 137 369 123 361 C110 353 106 340 108 325 C109 316 108 311 101 307 C94 303 95 295 103 289 C94 285 94 277 102 271 C94 267 94 259 100 254 C92 252 78 251 76 243 C73 234 85 220 96 207 L105 196 C113 186 114 177 111 165 C104 133 115 101 137 75 C166 40 207 19 250 14 C300 7 350 19 389 47 C432 77 457 123 459 171 C462 222 443 270 407 302 C395 313 378 324 367 337 C354 351 353 363 358 376 C361 384 366 391 372 397";
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
