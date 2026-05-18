// エサ効果ルールテーブル
// 農業作業カテゴリ → モンスターへの効果・反応を定義する
// ローカルAI育成ゲームの game.ts と pixelMonsterBehavior.ts を統合・整理

import type { FeedCategory } from './FeedModel';
import type { FeedReaction } from './FeedModel';

// 農業カテゴリ別のエサ効果ルール
export const FEED_RULES: Record<FeedCategory, FeedReaction> = {
  水やり: {
    effects:   { energy: 5, mood: 8, health: 3, growth: 2 },
    mood:      'happy',
    animation: 'jump',
    message:   '水をもらってうれしそうだ。',
  },
  施肥: {
    effects:   { energy: 0, mood: 2, health: 2, growth: 8 },
    mood:      'neutral',
    animation: 'eat',
    message:   '成長する力をためている。',
  },
  観察: {
    effects:   { energy: 0, mood: 5, health: 2, growth: 1 },
    mood:      'happy',
    animation: 'eat',
    message:   'よく見てもらえて安心しているようだ。',
  },
  収穫: {
    effects:   { energy: -2, mood: 10, health: 0, growth: 5 },
    mood:      'happy',
    animation: 'jump',
    message:   '今日の成果に満足しているようだ。',
  },
  防除: {
    effects:   { energy: -1, mood: -2, health: 8, growth: 0 },
    mood:      'dislike',
    animation: 'shake',
    message:   '少し嫌そうだが、体調は整ったようだ。',
  },
  その他: {
    effects:   { energy: 0, mood: 1, health: 0, growth: 0 },
    mood:      'neutral',
    animation: 'eat',
    message:   '何かを受け取って、少し考えている。',
  },
};

// エサカテゴリの表示色（UIボタン用）
export const FEED_COLORS: Record<FeedCategory, string> = {
  水やり: '#5BA3F5',
  施肥:   '#A87648',
  観察:   '#F5C542',
  収穫:   '#E74C3C',
  防除:   '#6B8E1F',
  その他: '#9AA6B2',
};

// カテゴリ別のアイコン（テキスト絵文字）
export const FEED_ICONS: Record<FeedCategory, string> = {
  水やり: '💧',
  施肥:   '🌱',
  観察:   '👁',
  収穫:   '🌾',
  防除:   '🛡',
  その他: '📝',
};

// カテゴリからルールを取得
export function getFeedReaction(category: FeedCategory): FeedReaction {
  return FEED_RULES[category];
}

// 再エクスポート（MonsterController が直接参照できるように）
export type { FeedReaction } from './FeedModel';
