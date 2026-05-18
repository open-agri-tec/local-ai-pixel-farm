// エサのデータモデル定義
// 農業作業日誌・センサーデータなどを「エサ」として表現する

import type { AnimationKind, MonsterMood } from '../monster/MonsterModel';

// エサのカテゴリ（農業作業の種類）
export type FeedCategory =
  | '水やり'
  | '施肥'
  | '観察'
  | '収穫'
  | '防除'
  | 'その他';

export const FEED_CATEGORIES: FeedCategory[] = [
  '水やり',
  '施肥',
  '観察',
  '収穫',
  '防除',
  'その他',
];

// エサの本体データ（保存される）
export interface Feed {
  id: string;
  name: string;           // エサの名前（例：「朝の水やり」）
  category: FeedCategory; // 農業作業カテゴリ
  memo: string;           // 自由メモ
  tags: string[];         // 追加タグ（将来拡張用）
  createdAt: string;
}

// エサの効果値（フィードルールから引く）
export interface FeedEffects {
  energy: number;
  mood:   number;
  health: number;
  growth: number;
}

// エサに対するモンスターの反応（feedRules から生成）
export interface FeedReaction {
  effects:   FeedEffects;
  mood:      MonsterMood;
  animation: AnimationKind;
  message:   string;
}
