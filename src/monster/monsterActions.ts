// モンスターアクションの定数と時間管理
// pixel-monster-lab の pixelMonsterBehavior.ts から分離

import type { AnimationKind } from './MonsterModel';

// 一時アクションの継続時間（ms）
export const ACTION_DURATIONS: Record<AnimationKind, number> = {
  jump:  700,
  eat:   600,
  shake: 700,
  idle:  0,
};

// 給餌シーケンスの各フェーズ継続時間（ms）
export const FOOD_PHASE_DURATIONS = {
  full:  500,  // エサが現れてモンスターが見つめる
  half:  500,  // 一口食べてもぐもぐ
  eaten: 250,  // 食べ終わりの余韻
} as const;

// 気分ラベル
export const MOOD_LABELS = {
  happy:   'うれしい',
  neutral: 'ふつう',
  dislike: 'にがて',
} as const;
