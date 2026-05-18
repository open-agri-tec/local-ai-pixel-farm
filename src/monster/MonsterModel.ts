// モンスターのデータモデル定義
// 農業データと紐付けた育成情報を管理する。

export type GrowthStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type MonsterMood = 'happy' | 'neutral' | 'dislike';

// Canvas描画用のアクション種別
export type AnimationKind = 'idle' | 'jump' | 'eat' | 'shake';

// エサ表示のフェーズ
export type FoodPhase = 'none' | 'full' | 'half' | 'eaten';

// ピクセル描画フレームに渡す情報
export interface FrameContext {
  now: number;
  elapsed: number;
  stage: GrowthStage;
  mood: MonsterMood;
  action: AnimationKind;
  actionElapsed: number;
  foodKind: string | null;
  foodPhase: FoodPhase;
  foodPhaseElapsed: number;
}

// Canvas定数
export const PIXEL_SCALE = 4;
export const GRID_SIZE = 48;
export const CANVAS_SIZE = GRID_SIZE * PIXEL_SCALE; // 192px

// モンスターの状態値
export interface MonsterStatus {
  energy: number;   // 元気 0〜100
  mood: number;     // 機嫌 0〜100
  health: number;   // 健康 0〜100
  growth: number;   // 成長度（100超え可）
}

// 作物情報（農業連携の核心）
export interface CropInfo {
  name: string;      // 作物名（例：ブロッコリー）
  variety: string;   // 品種
  field: string;     // ほ場名
  category: string;  // カテゴリ（蔬菜・米・果樹 etc.）
  memo: string;
}

// モンスターのメインモデル
export interface Monster {
  id: string;
  name: string;
  crop: CropInfo;
  status: MonsterStatus;
  stage: GrowthStage;
  currentAction: AnimationKind;
  actionStartedAt: number;
  lastReaction: string;
  foodKind: string | null;
  foodPhase: FoodPhase;
  foodPhaseStartedAt: number;
  createdAt: string;
  updatedAt: string;
}

// 表示用のUI状態（保存しない一時情報）
export interface MonsterUIState {
  mood: MonsterMood;
  message: string;
}

export const DEFAULT_STATUS: MonsterStatus = {
  energy: 60,
  mood: 50,
  health: 70,
  growth: 10,
};

export const DEFAULT_CROP: CropInfo = {
  name: '',
  variety: '',
  field: '',
  category: '蔬菜',
  memo: '',
};
