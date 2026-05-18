// 農業カテゴリ別エサやりボタン群
// pixel-monster-lab の like/normal/dislike から農業作業カテゴリに差し替え

import { FEED_CATEGORIES, type FeedCategory } from '../feed/FeedModel';
import { FEED_COLORS, FEED_ICONS } from '../feed/feedRules';

interface FeedButtonsProps {
  onFeed:   (category: FeedCategory) => void;
  disabled?: boolean;
}

export function FeedButtons({ onFeed, disabled = false }: FeedButtonsProps): JSX.Element {
  return (
    <div className="feed-buttons">
      {FEED_CATEGORIES.map(category => (
        <button
          key={category}
          type="button"
          className="feed-btn"
          style={{ '--feed-color': FEED_COLORS[category] } as React.CSSProperties}
          onClick={() => onFeed(category)}
          disabled={disabled}
        >
          <span className="feed-btn-icon">{FEED_ICONS[category]}</span>
          <span className="feed-btn-label">{category}</span>
        </button>
      ))}
    </div>
  );
}
