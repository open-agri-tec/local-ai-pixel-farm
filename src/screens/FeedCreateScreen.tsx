// エサ作成画面
// 農業作業を手入力してエサを作る

import { useState } from 'react';
import { FEED_CATEGORIES, type FeedCategory } from '../feed/FeedModel';
import { FEED_COLORS, FEED_ICONS } from '../feed/feedRules';
import { createFeed } from '../feed/feedFactory';
import type { Feed } from '../feed/FeedModel';
import { Button } from '../components/Button';

interface FeedCreateScreenProps {
  onComplete: (feed: Feed) => void;
  onBack:     () => void;
}

export function FeedCreateScreen({ onComplete, onBack }: FeedCreateScreenProps): JSX.Element {
  const [category, setCategory] = useState<FeedCategory>('水やり');
  const [name,     setName]     = useState('');
  const [memo,     setMemo]     = useState('');

  const handleCreate = () => {
    const feed = createFeed({
      name:     name.trim() || category,
      category,
      memo:     memo.trim(),
    });
    onComplete(feed);
    // フォームリセット
    setName('');
    setMemo('');
  };

  return (
    <div className="screen feed-create-screen">
      <h2 className="screen-title">✏️ エサを作る</h2>
      <p className="screen-desc">今日やった農作業を選んでください。</p>

      {/* カテゴリ選択 */}
      <div className="form-group">
        <label className="form-label">作業の種類</label>
        <div className="feed-category-grid">
          {FEED_CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              className={`feed-category-btn ${category === cat ? 'feed-category-btn-active' : ''}`}
              style={{ '--feed-color': FEED_COLORS[cat] } as React.CSSProperties}
              onClick={() => setCategory(cat)}
            >
              <span>{FEED_ICONS[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* エサの名前（任意） */}
      <div className="form-group">
        <label className="form-label">名前（省略可）</label>
        <input
          className="form-input"
          type="text"
          placeholder={`例：朝の${category}`}
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={30}
        />
      </div>

      {/* メモ（任意） */}
      <div className="form-group">
        <label className="form-label">メモ（省略可）</label>
        <textarea
          className="form-textarea"
          placeholder="気づいたこと、天気など…"
          value={memo}
          onChange={e => setMemo(e.target.value)}
          rows={3}
          maxLength={200}
        />
      </div>

      <div className="btn-row">
        <Button onClick={onBack} variant="secondary">もどる</Button>
        <Button onClick={handleCreate} fullWidth>エサを作る</Button>
      </div>
    </div>
  );
}
