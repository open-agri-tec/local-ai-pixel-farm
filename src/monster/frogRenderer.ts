// カエル型モンスターのステージ別ドット絵描画
// pixel-monster-lab/frogRenderer.ts から移植
// import先を MonsterModel に統一

import { fillRect, fillEllipse, fillCircle, setPixel, drawLine, strokeEllipse } from './pixelDraw';
import type { FrameContext } from './MonsterModel';

const COL = {
  body:       '#4CAF50',
  bodyDark:   '#2E7D32',
  bodyLight:  '#7CCB7E',
  belly:      '#D7E8B0',
  bellyDark:  '#A8C97A',
  eyeBump:    '#3F8E42',
  eyeWhite:   '#FFFFFF',
  pupil:      '#1A1A1A',
  mouth:      '#5C1A1A',
  tongue:     '#E07A8A',
  tadpole:    '#1B5E20',
  tadpoleDark:'#0E3812',
  egg:        '#FFF6D6',
  eggEdge:    '#C8B47A',
  eggHi:      '#FFFFFF',
  embryo:     '#2E7D32',
  crown:      '#FFD54F',
  crownEdge:  '#B58800',
};

// エサの色定義（feedRules の FeedCategory に対応）
const FOOD_COL: Record<string, { main: string; hi: string; [k: string]: string }> = {
  水やり:  { main: '#5BA3F5', hi: '#AACCFF', rim: '#2A6AD4' },
  施肥:    { main: '#A87648', hi: '#D9B27A', edge: '#5D3A18' },
  観察:    { main: '#F5D86A', hi: '#FFF3B0', edge: '#C8A832' },
  収穫:    { main: '#E74C3C', hi: '#FFC9C0', seed: '#FFF3B0', leaf: '#27AE60', leafDark: '#1F7D45' },
  防除:    { main: '#6B8E1F', hi: '#A8C95A', edge: '#3F5612', stem: '#5A4220' },
  その他:  { main: '#A0A0A0', hi: '#D0D0D0', edge: '#606060' },
  // 後方互換（pixel-monster-lab の like/normal/dislike）
  like:    { main: '#E74C3C', hi: '#FFC9C0', seed: '#FFF3B0', leaf: '#27AE60', leafDark: '#1F7D45' },
  normal:  { main: '#A87648', hi: '#D9B27A', edge: '#5D3A18' },
  dislike: { main: '#6B8E1F', hi: '#A8C95A', edge: '#3F5612', stem: '#5A4220' },
};

export function computeBodyOffset(frame: FrameContext): { dx: number; dy: number } {
  const { now, action, actionElapsed, stage } = frame;
  let dx = 0;
  let dy = 0;
  const bobSpeed = stage === 0 ? 0.0018 : 0.0035;
  const bobAmp   = stage === 0 ? 0.4   : 0.7;
  dy += Math.sin(now * bobSpeed) * bobAmp;
  if (stage >= 4) {
    const hopPhase = (now % 4200) / 4200;
    if (hopPhase < 0.18) {
      const p = hopPhase / 0.18;
      dy -= Math.sin(p * Math.PI) * 1.5;
    }
  }
  if (action === 'jump') {
    const p = Math.min(1, actionElapsed / 700);
    dy -= Math.sin(p * Math.PI) * 9;
  } else if (action === 'shake') {
    const p = Math.min(1, actionElapsed / 700);
    const fade = 1 - p;
    dx += Math.sin(actionElapsed * 0.05) * 3 * fade;
  }
  return { dx: Math.round(dx), dy: Math.round(dy) };
}

function eggPulse(now: number): number {
  return 1 + Math.sin(now * 0.0035) * 0.06;
}

function isBlinking(now: number): boolean {
  return now % 2800 < 130;
}

export function renderFrog(ctx: CanvasRenderingContext2D, frame: FrameContext): void {
  const { stage } = frame;
  const off = computeBodyOffset(frame);
  if      (stage === 0) drawEgg(ctx, frame, off.dx, off.dy);
  else if (stage === 1) drawTadpole(ctx, frame, off.dx, off.dy, { backLegs: false, frontLegs: false });
  else if (stage === 2) drawTadpole(ctx, frame, off.dx, off.dy, { backLegs: true,  frontLegs: false });
  else if (stage === 3) drawTadpole(ctx, frame, off.dx, off.dy, { backLegs: true,  frontLegs: true  });
  else if (stage === 4) drawFrog(ctx, frame, off.dx, off.dy, { size: 'small', tail: true,  crown: false });
  else if (stage === 5) drawFrog(ctx, frame, off.dx, off.dy, { size: 'small', tail: false, crown: false });
  else if (stage === 6) drawFrog(ctx, frame, off.dx, off.dy, { size: 'large', tail: false, crown: false });
  else                  drawFrog(ctx, frame, off.dx, off.dy, { size: 'large', tail: false, crown: true  });
  drawFood(ctx, frame);
}

function drawFood(ctx: CanvasRenderingContext2D, frame: FrameContext): void {
  const { foodKind, foodPhase, foodPhaseElapsed, now } = frame;
  if (!foodKind || foodPhase === 'none') return;
  const baseX = 36;
  const baseY = 33;
  let oy = Math.round(Math.sin(now * 0.005) * 0.5);
  if (foodPhase === 'full' && foodPhaseElapsed < 200) {
    oy += Math.round((1 - foodPhaseElapsed / 200) * -3);
  } else if (foodPhase === 'half' && foodPhaseElapsed < 150) {
    oy += Math.round(Math.sin(foodPhaseElapsed * 0.08) * 0.6);
  } else if (foodPhase === 'eaten') {
    drawFoodCrumbs(ctx, foodKind, baseX, baseY + oy, foodPhaseElapsed);
    return;
  }
  drawFoodShape(ctx, foodKind, baseX, baseY + oy, foodPhase as 'full' | 'half');
}

function drawFoodShape(
  ctx: CanvasRenderingContext2D,
  kind: string,
  cx: number, cy: number,
  phase: 'full' | 'half',
): void {
  const c = FOOD_COL[kind] ?? FOOD_COL['その他'];
  // 収穫・like はベリー形
  if (kind === '収穫' || kind === 'like') {
    if (phase === 'full') {
      fillEllipse(ctx, cx, cy, 2.6, 3, c.main);
      setPixel(ctx, cx - 1, cy - 1, c.hi); setPixel(ctx, cx - 1, cy, c.hi);
      setPixel(ctx, cx + 1, cy, c['seed'] ?? c.hi); setPixel(ctx, cx, cy + 1, c['seed'] ?? c.hi);
      setPixel(ctx, cx - 1, cy - 3, c['leaf'] ?? c.main); setPixel(ctx, cx, cy - 4, c['leaf'] ?? c.main);
    } else {
      fillEllipse(ctx, cx - 1, cy, 2, 3, c.main);
      setPixel(ctx, cx - 1, cy - 1, c.hi);
      setPixel(ctx, cx - 1, cy - 3, c['leaf'] ?? c.main);
    }
  // 施肥・normal はペレット形
  } else if (kind === '施肥' || kind === 'normal') {
    if (phase === 'full') {
      fillRect(ctx, cx - 2, cy - 1, 5, 3, c.main);
      setPixel(ctx, cx - 1, cy - 1, c.hi); setPixel(ctx, cx, cy - 1, c.hi);
    } else {
      fillRect(ctx, cx - 2, cy - 1, 3, 3, c.main);
      setPixel(ctx, cx - 1, cy - 1, c.hi);
    }
  // 水やり は雫形
  } else if (kind === '水やり') {
    if (phase === 'full') {
      fillEllipse(ctx, cx, cy + 1, 2.5, 2, c.main);
      setPixel(ctx, cx, cy - 1, c.main); setPixel(ctx, cx, cy, c.main);
      setPixel(ctx, cx - 1, cy, c.hi);
    } else {
      fillEllipse(ctx, cx - 1, cy + 1, 1.5, 2, c.main);
      setPixel(ctx, cx, cy, c.main);
    }
  // 観察 は星形っぽく
  } else if (kind === '観察') {
    if (phase === 'full') {
      setPixel(ctx, cx, cy - 2, c.main); setPixel(ctx, cx, cy + 2, c.main);
      setPixel(ctx, cx - 2, cy, c.main); setPixel(ctx, cx + 2, cy, c.main);
      fillEllipse(ctx, cx, cy, 1.5, 1.5, c.main);
      setPixel(ctx, cx - 1, cy - 1, c.hi);
    } else {
      fillEllipse(ctx, cx - 1, cy, 1.5, 1.5, c.main);
      setPixel(ctx, cx - 1, cy - 2, c.main);
    }
  // 防除・dislike は葉形
  } else {
    if (phase === 'full') {
      fillEllipse(ctx, cx, cy, 3, 2, c.main);
      setPixel(ctx, cx, cy - 1, c.hi); setPixel(ctx, cx - 1, cy - 2, c.main);
    } else {
      fillEllipse(ctx, cx - 1, cy, 2, 2, c.main);
      setPixel(ctx, cx, cy - 1, c.main);
    }
  }
}

function drawFoodCrumbs(
  ctx: CanvasRenderingContext2D,
  kind: string, cx: number, cy: number, elapsed: number,
): void {
  const c = FOOD_COL[kind] ?? FOOD_COL['その他'];
  const t = Math.min(1, elapsed / 250);
  const spread = Math.round(t * 3);
  const yoff = -Math.round(Math.sin(t * Math.PI) * 2);
  setPixel(ctx, cx - spread, cy + yoff, c.main);
  setPixel(ctx, cx,          cy + yoff - 1, c.main);
  setPixel(ctx, cx + spread, cy + yoff, c.main);
}

function drawEgg(ctx: CanvasRenderingContext2D, frame: FrameContext, dx: number, dy: number): void {
  const cx = 24 + dx;
  const cy = 30 + dy;
  const pulse = eggPulse(frame.now);
  const rx = 9 * pulse;
  const ry = 11 * pulse;
  fillEllipse(ctx, cx, cy + ry + 1, rx * 0.9, 1.4, '#00000022');
  fillEllipse(ctx, cx, cy, rx, ry, COL.egg);
  strokeEllipse(ctx, cx, cy, rx, ry, COL.eggEdge);
  fillEllipse(ctx, cx - rx * 0.45, cy - ry * 0.45, rx * 0.25, ry * 0.2, COL.eggHi);
  const embryoR = 2 + Math.sin(frame.now * 0.0018) * 0.4;
  fillEllipse(ctx, cx + Math.sin(frame.now * 0.0012) * 0.6, cy + 1, embryoR, embryoR, COL.embryo);
  setPixel(ctx, Math.round(cx + 0.5), Math.round(cy + 1), COL.tadpoleDark);
}

function drawTadpole(
  ctx: CanvasRenderingContext2D,
  frame: FrameContext, dx: number, dy: number,
  legs: { backLegs: boolean; frontLegs: boolean },
): void {
  const cx = 24 + dx;
  const cy = 28 + dy;
  fillEllipse(ctx, cx, cy + 7, 8, 1.2, '#00000033');
  const wag = Math.sin(frame.now * 0.012) * 2;
  fillRect(ctx, cx - 9, cy - 1, 4, 4, COL.tadpole);
  const s2y = Math.round(cy - 1 + wag * 0.25);
  fillRect(ctx, cx - 12, s2y, 3, 3, COL.tadpole);
  const s3y = Math.round(cy - 1 + wag * 0.5);
  fillRect(ctx, cx - 14, s3y, 2, 2, COL.tadpole);
  const s4y = Math.round(cy + wag * 0.9);
  fillRect(ctx, cx - 15, s4y - 1, 2, 3, COL.tadpoleDark);
  if (legs.backLegs) {
    fillRect(ctx, cx - 5, cy + 4, 2, 3, COL.tadpole);
    fillRect(ctx, cx - 5, cy + 6, 3, 1, COL.tadpole);
    fillRect(ctx, cx - 3, cy + 4, 2, 3, COL.tadpole);
    fillRect(ctx, cx - 3, cy + 6, 3, 1, COL.tadpole);
  }
  if (legs.frontLegs) {
    fillRect(ctx, cx + 1, cy + 3, 2, 2, COL.tadpole);
    fillRect(ctx, cx + 3, cy + 4, 2, 2, COL.tadpole);
  }
  fillEllipse(ctx, cx + 2, cy, 6, 5, COL.tadpole);
  fillEllipse(ctx, cx + 1, cy - 2, 4, 2, COL.bodyDark);
  if (isBlinking(frame.now)) {
    drawLine(ctx, cx + 4, cy - 1, cx + 6, cy - 1, COL.pupil);
  } else {
    fillCircle(ctx, cx + 5, cy - 1, 1.8, COL.eyeWhite);
    setPixel(ctx, cx + 5, cy - 1, COL.pupil);
    setPixel(ctx, cx + 6, cy - 1, COL.pupil);
  }
  drawMouth(ctx, frame, cx + 5, cy + 2);
}

function drawFrog(
  ctx: CanvasRenderingContext2D,
  frame: FrameContext, dx: number, dy: number,
  opt: { size: 'small' | 'large'; tail: boolean; crown: boolean },
): void {
  const big = opt.size === 'large';
  const cx = 24 + dx;
  const cy = (big ? 30 : 31) + dy;
  const shadowR = big ? 11 : 9;
  fillEllipse(ctx, cx, cy + (big ? 9 : 7), shadowR, 1.4, '#00000033');
  if (opt.tail) {
    fillRect(ctx, cx - 3, cy + 6, 2, 2, COL.bodyDark);
    fillRect(ctx, cx - 5, cy + 7, 2, 1, COL.bodyDark);
  }
  if (big) {
    fillEllipse(ctx, cx - 9, cy + 4, 4, 3, COL.body);
    fillEllipse(ctx, cx + 9, cy + 4, 4, 3, COL.body);
    fillRect(ctx, cx - 13, cy + 5, 3, 2, COL.bodyDark);
    fillRect(ctx, cx + 11, cy + 5, 3, 2, COL.bodyDark);
    setPixel(ctx, cx - 14, cy + 6, COL.bodyDark);
    setPixel(ctx, cx + 13, cy + 6, COL.bodyDark);
    fillRect(ctx, cx - 8, cy + 1, 3, 4, COL.body);
    fillRect(ctx, cx + 6, cy + 1, 3, 4, COL.body);
    fillRect(ctx, cx - 8, cy + 5, 4, 2, COL.bodyDark);
    fillRect(ctx, cx + 5, cy + 5, 4, 2, COL.bodyDark);
  } else {
    fillEllipse(ctx, cx - 7, cy + 3, 3, 2, COL.body);
    fillEllipse(ctx, cx + 7, cy + 3, 3, 2, COL.body);
    fillRect(ctx, cx - 10, cy + 4, 3, 1, COL.bodyDark);
    fillRect(ctx, cx + 8,  cy + 4, 3, 1, COL.bodyDark);
    fillRect(ctx, cx - 7, cy + 1, 2, 3, COL.body);
    fillRect(ctx, cx + 6, cy + 1, 2, 3, COL.body);
    fillRect(ctx, cx - 8, cy + 4, 3, 1, COL.bodyDark);
    fillRect(ctx, cx + 6, cy + 4, 3, 1, COL.bodyDark);
  }
  const breath = Math.sin(frame.now * 0.004) * 0.4;
  const bodyRx = (big ? 9 : 7) + breath;
  const bodyRy = (big ? 7 : 6) + breath * 0.5;
  fillEllipse(ctx, cx, cy + 1, bodyRx, bodyRy, COL.body);
  fillEllipse(ctx, cx, cy - 1, bodyRx * 0.65, bodyRy * 0.5, COL.bodyLight);
  fillEllipse(ctx, cx, cy + 3, bodyRx * 0.55, bodyRy * 0.55, COL.belly);
  setPixel(ctx, cx - 1, cy + 4, COL.bellyDark);
  setPixel(ctx, cx + 1, cy + 4, COL.bellyDark);
  const headCy = cy - (big ? 6 : 5);
  const headRx = big ? 8 : 6;
  const headRy = big ? 5 : 4;
  fillEllipse(ctx, cx, headCy + 1, headRx, headRy, COL.body);
  fillEllipse(ctx, cx, headCy - 1, headRx * 0.6, 1, COL.bodyLight);
  drawFrogEye(ctx, frame, cx - (big ? 4 : 3), headCy - (big ? 3 : 2), big);
  drawFrogEye(ctx, frame, cx + (big ? 4 : 3), headCy - (big ? 3 : 2), big);
  drawMouth(ctx, frame, cx, headCy + (big ? 3 : 2));
  if (big) {
    setPixel(ctx, cx - 4, cy, COL.bodyDark);
    setPixel(ctx, cx + 5, cy - 1, COL.bodyDark);
    setPixel(ctx, cx - 2, cy - 2, COL.bodyDark);
    setPixel(ctx, cx + 2, cy + 1, COL.bodyDark);
  }
  if (opt.crown) drawCrown(ctx, cx, headCy - (big ? 6 : 5));
}

function drawFrogEye(
  ctx: CanvasRenderingContext2D,
  frame: FrameContext, cx: number, cy: number, big: boolean,
): void {
  const r = big ? 2.5 : 2;
  fillCircle(ctx, cx, cy, r + 0.5, COL.eyeBump);
  if (isBlinking(frame.now)) {
    drawLine(ctx, cx - 1, cy, cx + 1, cy, COL.pupil);
  } else {
    fillCircle(ctx, cx, cy, r - 0.3, COL.eyeWhite);
    setPixel(ctx, cx, cy, COL.pupil);
    if (big) setPixel(ctx, cx, cy + 1, COL.pupil);
    setPixel(ctx, cx - 1, cy - 1, COL.eyeWhite);
  }
}

function drawMouth(
  ctx: CanvasRenderingContext2D,
  frame: FrameContext, cx: number, cy: number,
): void {
  const { mood, action, actionElapsed } = frame;
  if (action === 'eat') {
    const t = (actionElapsed / 100) | 0;
    if (t % 2 === 0) {
      fillRect(ctx, cx - 1, cy, 3, 2, COL.mouth);
      setPixel(ctx, cx, cy + 1, COL.tongue);
    } else {
      drawLine(ctx, cx - 2, cy, cx + 2, cy, COL.mouth);
    }
    return;
  }
  if (mood === 'happy') {
    setPixel(ctx, cx - 2, cy, COL.mouth);
    setPixel(ctx, cx - 1, cy + 1, COL.mouth);
    setPixel(ctx, cx,     cy + 1, COL.mouth);
    setPixel(ctx, cx + 1, cy + 1, COL.mouth);
    setPixel(ctx, cx + 2, cy, COL.mouth);
  } else if (mood === 'dislike') {
    setPixel(ctx, cx - 2, cy + 1, COL.mouth);
    setPixel(ctx, cx - 1, cy, COL.mouth);
    setPixel(ctx, cx,     cy, COL.mouth);
    setPixel(ctx, cx + 1, cy, COL.mouth);
    setPixel(ctx, cx + 2, cy + 1, COL.mouth);
  } else {
    drawLine(ctx, cx - 2, cy, cx + 2, cy, COL.mouth);
  }
}

function drawCrown(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  fillRect(ctx, cx - 4, cy + 1, 1, 2, COL.crown);
  setPixel(ctx, cx - 4, cy, COL.crown);
  fillRect(ctx, cx, cy, 1, 3, COL.crown);
  setPixel(ctx, cx, cy - 1, COL.crown);
  fillRect(ctx, cx + 4, cy + 1, 1, 2, COL.crown);
  setPixel(ctx, cx + 4, cy, COL.crown);
  fillRect(ctx, cx - 4, cy + 3, 9, 1, COL.crown);
  setPixel(ctx, cx - 4, cy + 4, COL.crownEdge);
  setPixel(ctx, cx + 4, cy + 4, COL.crownEdge);
  setPixel(ctx, cx,     cy + 4, COL.crownEdge);
}
