// モンスターの行動・状態更新を管理するコントローラー
// App.tsx に直書きしていた給餌ロジックをここに集約する

import type { Monster, MonsterMood, AnimationKind } from './MonsterModel';
import type { FeedReaction } from '../feed/feedRules';
import { getStageFromGrowth, checkEvolution, STAGE_LABELS } from './monsterGrowth';
import { ACTION_DURATIONS, FOOD_PHASE_DURATIONS } from './monsterActions';

// 給餌シーケンスのスケジューラ（外部から注入）
export type Scheduler = (fn: () => void, delay: number) => number;
export type StateUpdater<T> = (updater: (prev: T) => T) => void;

// 画面表示用の一時状態
export interface FeedingUIState {
  mood: MonsterMood;
  message: string;
  action: AnimationKind;
  actionStartedAt: number;
  foodKind: string | null;
  foodPhase: 'none' | 'full' | 'half' | 'eaten';
  foodPhaseStartedAt: number;
}

// 給餌完了後にモンスターのステータスを更新する（純粋関数）
export function applyFeedToMonster(monster: Monster, reaction: FeedReaction): Monster {
  const now = new Date().toISOString();
  const clamp = (v: number) => Math.max(0, Math.min(100, v));
  return {
    ...monster,
    status: {
      energy: clamp(monster.status.energy + reaction.effects.energy),
      mood:   clamp(monster.status.mood   + reaction.effects.mood),
      health: clamp(monster.status.health + reaction.effects.health),
      growth: monster.status.growth + reaction.effects.growth,
    },
    stage:       getStageFromGrowth(monster.status.growth + reaction.effects.growth),
    lastReaction: reaction.message,
    updatedAt:   now,
  };
}

// 給餌アニメーションシーケンスを組み立てて実行する
// 呼び出し元は schedule と setUI を提供する
export function runFeedSequence(params: {
  monster: Monster;
  reaction: FeedReaction;
  feedCategory: string;
  schedule: Scheduler;
  setUI: StateUpdater<FeedingUIState>;
  onComplete: (updated: Monster) => void;
}): void {
  const { monster, reaction, feedCategory, schedule, setUI, onComplete } = params;

  const prevGrowth = monster.status.growth;
  const nextGrowth = prevGrowth + reaction.effects.growth;
  const evolved    = checkEvolution(prevGrowth, nextGrowth);

  const finalAction: AnimationKind = evolved ? 'jump' : reaction.animation;
  const finalMood:   MonsterMood   = evolved ? 'happy' : reaction.mood;
  const finalMessage = evolved
    ? `${reaction.message}（${STAGE_LABELS[getStageFromGrowth(nextGrowth)]} に進化した！）`
    : reaction.message;

  const t0 = performance.now();

  // Phase 1: エサが現れる
  setUI(() => ({
    mood:             'neutral',
    message:          'エサを差し出した。',
    action:           'idle',
    actionStartedAt:  t0,
    foodKind:         feedCategory,
    foodPhase:        'full',
    foodPhaseStartedAt: t0,
  }));

  // Phase 2: 一口目
  schedule(() => {
    const ts = performance.now();
    setUI(prev => ({ ...prev, foodPhase: 'half', foodPhaseStartedAt: ts, action: 'eat', actionStartedAt: ts, message: '一口食べた。' }));

    // Phase 3: 二口目
    schedule(() => {
      const ts2 = performance.now();
      setUI(prev => ({ ...prev, foodPhase: 'eaten', foodPhaseStartedAt: ts2, action: 'eat', actionStartedAt: ts2, message: 'もう一口食べた。' }));

      // Phase 4: 反応
      schedule(() => {
        const ts3 = performance.now();
        setUI(() => ({
          mood:             finalMood,
          message:          finalMessage,
          action:           finalAction,
          actionStartedAt:  ts3,
          foodKind:         null,
          foodPhase:        'none',
          foodPhaseStartedAt: 0,
        }));

        // アクション終了 → idle
        schedule(() => {
          setUI(prev => ({ ...prev, action: 'idle' }));
          schedule(() => {
            setUI(prev => ({ ...prev, mood: 'neutral' }));
          }, 1800);
          // ステータス反映
          onComplete(applyFeedToMonster(monster, reaction));
        }, ACTION_DURATIONS[finalAction]);
      }, FOOD_PHASE_DURATIONS.eaten);
    }, FOOD_PHASE_DURATIONS.half);
  }, FOOD_PHASE_DURATIONS.full);
}
