// 48×48 グリッドのドット絵モンスターを描画する Canvas コンポーネント
// pixel-monster-lab の PixelMonsterCanvas.tsx から移植

import { useEffect, useRef } from 'react';
import { CANVAS_SIZE } from './MonsterModel';
import type { AnimationKind, FoodPhase, GrowthStage, MonsterMood } from './MonsterModel';
import { clearCanvas } from './pixelDraw';
import { renderFrog } from './frogRenderer';

export interface MonsterRendererProps {
  stage: GrowthStage;
  mood: MonsterMood;
  action: AnimationKind;
  actionStartedAt: number;
  foodKind: string | null;
  foodPhase: FoodPhase;
  foodPhaseStartedAt: number;
}

export function MonsterRenderer(props: MonsterRendererProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const propsRef  = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let rafId = 0;
    const startedAt = performance.now();

    const tick = (now: number): void => {
      const p = propsRef.current;
      clearCanvas(ctx, 'transparent');
      const action        = p.action;
      const actionElapsed = action === 'idle' ? 0 : Math.max(0, now - p.actionStartedAt);
      const foodPhaseElapsed =
        p.foodPhase === 'none' ? 0 : Math.max(0, now - p.foodPhaseStartedAt);
      renderFrog(ctx, {
        now,
        elapsed: now - startedAt,
        stage:   p.stage,
        mood:    p.mood,
        action,
        actionElapsed,
        foodKind:         p.foodKind,
        foodPhase:        p.foodPhase,
        foodPhaseElapsed,
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_SIZE}
      height={CANVAS_SIZE}
      className="pixel-monster-canvas"
      style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, imageRendering: 'pixelated' }}
    />
  );
}
