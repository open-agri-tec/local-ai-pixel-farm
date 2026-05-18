// サンプルエサデータ（初回起動時のデモ用）
// 実際の農業作業をイメージしたデータ

import type { Feed } from '../feed/FeedModel';

export const SAMPLE_FEEDS: Feed[] = [
  {
    id:        'sample_feed_001',
    name:      '朝の水やり',
    category:  '水やり',
    memo:      'ハウスで朝に水やりした',
    tags:      ['朝', 'ハウス'],
    createdAt: new Date().toISOString(),
  },
  {
    id:        'sample_feed_002',
    name:      '生育観察',
    category:  '観察',
    memo:      '本葉が展開してきた。順調',
    tags:      ['観察'],
    createdAt: new Date().toISOString(),
  },
  {
    id:        'sample_feed_003',
    name:      '追肥',
    category:  '施肥',
    memo:      '化成肥料を施用',
    tags:      ['施肥'],
    createdAt: new Date().toISOString(),
  },
];
