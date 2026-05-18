// 成長段階の判定とラベル管理
// pixel-monster-lab の pixelMonsterGrowth.ts から移植・拡張

import type { GrowthStage } from './MonsterModel';

// 成長段階のラベル（exp ベース）
export const STAGE_LABELS: Record<GrowthStage, string> = {
  0: '卵',
  1: 'オタマジャクシ',
  2: '後脚発生',
  3: '前脚発生',
  4: 'カエル幼体',
  5: '若いカエル',
  6: '大人のカエル',
  7: '成熟個体',
};

// 次の段階に到達するために必要な growth 合計値
export const STAGE_THRESHOLDS: Record<GrowthStage, number> = {
  0: 20,
  1: 45,
  2: 75,
  3: 110,
  4: 150,
  5: 200,
  6: 260,
  7: Number.POSITIVE_INFINITY,
};

// growth 値から成長段階を返す
export function getStageFromGrowth(growth: number): GrowthStage {
  if (growth < 20)  return 0;
  if (growth < 45)  return 1;
  if (growth < 75)  return 2;
  if (growth < 110) return 3;
  if (growth < 150) return 4;
  if (growth < 200) return 5;
  if (growth < 260) return 6;
  return 7;
}

// 進化チェック：前のgrowthと次のgrowthで段階が変わるか
export function checkEvolution(prevGrowth: number, nextGrowth: number): boolean {
  return getStageFromGrowth(prevGrowth) < getStageFromGrowth(nextGrowth);
}

// プログレスバー用：現段階内での進捗 (0〜1)
export function getStageProgress(growth: number): number {
  const stage = getStageFromGrowth(growth);
  if (stage === 7) return 1;
  const prevThreshold = stage === 0 ? 0 : STAGE_THRESHOLDS[(stage - 1) as GrowthStage];
  const nextThreshold = STAGE_THRESHOLDS[stage];
  return Math.max(0, Math.min(1, (growth - prevThreshold) / (nextThreshold - prevThreshold)));
}
