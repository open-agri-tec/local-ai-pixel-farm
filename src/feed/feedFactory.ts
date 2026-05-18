// エサ生成ファクトリ
// ユーザー入力からエサデータを組み立てる

import type { Feed, FeedCategory } from './FeedModel';

let _counter = 0;
function genId(): string {
  return `feed_${Date.now()}_${++_counter}`;
}

export function createFeed(params: {
  name: string;
  category: FeedCategory;
  memo?: string;
  tags?: string[];
}): Feed {
  return {
    id:        genId(),
    name:      params.name.trim() || params.category,
    category:  params.category,
    memo:      params.memo?.trim() ?? '',
    tags:      params.tags ?? [],
    createdAt: new Date().toISOString(),
  };
}
