// 記録の生成ユーティリティ

import type { FarmRecord } from './RecordModel';
import type { Monster, MonsterStatus } from '../monster/MonsterModel';
import type { Feed } from '../feed/FeedModel';

let _counter = 0;
function genId(): string {
  return `record_${Date.now()}_${++_counter}`;
}

export function createRecord(params: {
  monster:      Monster;
  feed:         Feed;
  reaction:     string;
  action:       string;
  beforeStatus: MonsterStatus;
  afterStatus:  MonsterStatus;
}): FarmRecord {
  return {
    id:           genId(),
    monsterId:    params.monster.id,
    feedId:       params.feed.id,
    monsterName:  params.monster.name,
    feedName:     params.feed.name,
    feedCategory: params.feed.category,
    reaction:     params.reaction,
    action:       params.action,
    beforeStatus: { ...params.beforeStatus },
    afterStatus:  { ...params.afterStatus },
    createdAt:    new Date().toISOString(),
  };
}
