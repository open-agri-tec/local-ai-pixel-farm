// LocalBrain：モンスターの反応判定を担う仮AIモジュール
// 現在はルールベース。将来的に本物のローカルAIに差し替えられるよう
// analyzeFeed(monster, feed) という入口を維持する。

import type { Monster } from '../monster/MonsterModel';
import type { Feed, FeedReaction } from '../feed/FeedModel';
import { computeReaction } from './reactionRules';

export interface BrainAnalysis {
  reaction:    FeedReaction;
  commentary:  string;  // モンスターの内部状態コメント（将来表示用）
}

// メインの分析関数。外部からはこれだけ呼ぶ。
export function analyzeFeed(monster: Monster, feed: Feed): BrainAnalysis {
  const reaction = computeReaction(monster, feed);

  // 仮コメント生成（将来AIが担う部分）
  const commentary = buildCommentary(monster, feed, reaction);

  return { reaction, commentary };
}

function buildCommentary(monster: Monster, feed: Feed, reaction: FeedReaction): string {
  const name = monster.name;
  const crop = monster.crop.name || '作物';
  if (reaction.mood === 'happy') {
    return `${name}は${crop}のために${feed.category}をもらい、元気が出たようだ。`;
  }
  if (reaction.mood === 'dislike') {
    return `${name}は${feed.category}が少し苦手なようだが、${crop}のためには必要なことだ。`;
  }
  return `${name}は${feed.category}を静かに受け取った。`;
}
