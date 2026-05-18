// 反応判定ルール（仮ルールベース）
// 将来的に LocalBrain.ts でAI化できるよう、入口を統一しておく

import type { Monster } from '../monster/MonsterModel';
import type { Feed, FeedReaction } from '../feed/FeedModel';
import { getFeedReaction } from '../feed/feedRules';

// モンスターの好みタグ（将来的に monster.tastes に持たせる候補）
// 現在はカテゴリベースのルールのみ使用
export function computeReaction(_monster: Monster, feed: Feed): FeedReaction {
  // 基本反応はカテゴリで決まる
  const base = getFeedReaction(feed.category);

  // 将来：モンスター個体差・圃場状態・季節による補正をここで加える
  // 例: if (monster.crop.category === '蔬菜' && feed.category === '水やり') { ... }

  return base;
}
