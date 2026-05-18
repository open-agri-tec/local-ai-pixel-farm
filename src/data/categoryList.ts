// 農業カテゴリ（作物の種類）定義
// ローカルAI育成ゲームの types.ts から移植

export type CropCategory =
  | '米'
  | '蔬菜'
  | '果樹'
  | '花き'
  | '畜産'
  | 'その他';

export const CROP_CATEGORIES: CropCategory[] = [
  '米',
  '蔬菜',
  '果樹',
  '花き',
  '畜産',
  'その他',
];
