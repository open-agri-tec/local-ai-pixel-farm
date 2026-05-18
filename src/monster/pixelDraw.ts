// ピクセル描画の低レベル関数群
// すべての座標は 48x48 のグリッド座標で指定する。
// 実際の Canvas には PIXEL_SCALE 倍で描画する。

import { GRID_SIZE, PIXEL_SCALE } from './MonsterModel';

export function clearCanvas(ctx: CanvasRenderingContext2D, bg: string = 'transparent'): void {
  ctx.save();
  if (bg === 'transparent') {
    ctx.clearRect(0, 0, GRID_SIZE * PIXEL_SCALE, GRID_SIZE * PIXEL_SCALE);
  } else {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, GRID_SIZE * PIXEL_SCALE, GRID_SIZE * PIXEL_SCALE);
  }
  ctx.restore();
}

export function setPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string): void {
  if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return;
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x) * PIXEL_SCALE, Math.floor(y) * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);
}

export function fillRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, color: string,
): void {
  for (let yy = 0; yy < h; yy++) {
    for (let xx = 0; xx < w; xx++) {
      setPixel(ctx, x + xx, y + yy, color);
    }
  }
}

export function fillEllipse(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, rx: number, ry: number, color: string,
): void {
  if (rx <= 0 || ry <= 0) return;
  const x0 = Math.floor(cx - rx);
  const x1 = Math.ceil(cx + rx);
  const y0 = Math.floor(cy - ry);
  const y1 = Math.ceil(cy + ry);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = (x + 0.5 - cx) / rx;
      const dy = (y + 0.5 - cy) / ry;
      if (dx * dx + dy * dy <= 1) setPixel(ctx, x, y, color);
    }
  }
}

export function strokeEllipse(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, rx: number, ry: number, color: string,
): void {
  if (rx <= 0 || ry <= 0) return;
  const x0 = Math.floor(cx - rx) - 1;
  const x1 = Math.ceil(cx + rx) + 1;
  const y0 = Math.floor(cy - ry) - 1;
  const y1 = Math.ceil(cy + ry) + 1;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = (x + 0.5 - cx) / rx;
      const dy = (y + 0.5 - cy) / ry;
      const v = dx * dx + dy * dy;
      if (v <= 1.0 && v >= 0.55) setPixel(ctx, x, y, color);
    }
  }
}

export function fillCircle(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number, color: string,
): void {
  fillEllipse(ctx, cx, cy, r, r, color);
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  x0: number, y0: number, x1: number, y1: number, color: string,
): void {
  let xa = Math.floor(x0);
  let ya = Math.floor(y0);
  const xb = Math.floor(x1);
  const yb = Math.floor(y1);
  const dx = Math.abs(xb - xa);
  const dy = -Math.abs(yb - ya);
  const sx = xa < xb ? 1 : -1;
  const sy = ya < yb ? 1 : -1;
  let err = dx + dy;
  for (let i = 0; i < 200; i++) {
    setPixel(ctx, xa, ya, color);
    if (xa === xb && ya === yb) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; xa += sx; }
    if (e2 <= dx) { err += dx; ya += sy; }
  }
}
