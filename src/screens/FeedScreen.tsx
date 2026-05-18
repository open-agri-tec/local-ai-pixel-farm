// エサやり画面
// 作成済みのエサ一覧を表示し、選んでモンスターに与える

import type { Feed } from '../feed/FeedModel';
import { FEED_COLORS, FEED_ICONS } from '../feed/feedRules';
import { Button } from '../components/Button';

interface FeedScreenProps {
  feeds:     Feed[];
  isFeeding: boolean;
  onFeed:    (feed: Feed) => void;
  onGoCreate: () => void;
  onBack:    () => void;
}

export function FeedScreen({
  feeds, isFeeding, onFeed, onGoCreate, onBack,
}: FeedScreenProps): JSX.Element {
  return (
    <div className="screen feed-screen">
      <h2 className="screen-title">🌿 エサをあげる</h2>

      {feeds.length === 0 ? (
        <div className="empty-state">
          <p>エサがまだありません。</p>
          <Button onClick={onGoCreate}>エサを作る</Button>
        </div>
      ) : (
        <div className="feed-list">
          {feeds.map(feed => (
            <button
              key={feed.id}
              type="button"
              className="feed-item"
              style={{ '--feed-color': FEED_COLORS[feed.category] } as React.CSSProperties}
              onClick={() => onFeed(feed)}
              disabled={isFeeding}
            >
              <span className="feed-item-icon">{FEED_ICONS[feed.category]}</span>
              <div className="feed-item-info">
                <span className="feed-item-name">{feed.name}</span>
                {feed.memo && <span className="feed-item-memo">{feed.memo}</span>}
              </div>
              <span className="feed-item-category">{feed.category}</span>
            </button>
          ))}
        </div>
      )}

      <div className="btn-row" style={{ marginTop: 12 }}>
        <Button onClick={onBack} variant="secondary">もどる</Button>
        <Button onClick={onGoCreate} variant="secondary">エサ作成</Button>
      </div>
    </div>
  );
}
