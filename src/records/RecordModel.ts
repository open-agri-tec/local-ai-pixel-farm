// 記録（エサやり履歴）のデータモデル
// 組み込みの Record<K,V> と名前衝突しないよう FarmRecord と命名

import type { MonsterStatus } from '../monster/MonsterModel';

export interface FarmRecord {
  id:           string;
  monsterId:    string;
  feedId:       string;
  monsterName:  string;
  feedName:     string;
  feedCategory: string;
  reaction:     string;
  action:       string;
  beforeStatus: MonsterStatus;
  afterStatus:  MonsterStatus;
  createdAt:    string;
}
