// 記録画面
// エサやり履歴の一覧を表示する

import type { FarmRecord } from '../records/RecordModel';
import { FEED_ICONS } from '../feed/feedRules';
import type { FeedCategory } from '../feed/FeedModel';
import { Button } from '../components/Button';
import { Accordion } from '../components/Accordion';

interface RecordScreenProps {
  records: FarmRecord[];
  onBack:  () => void;
}

export function RecordScreen({ records, onBack }: RecordScreenProps): JSX.Element {
  return (
    <div className="screen record-screen">
      <h2 className="screen-title">📋 記録</h2>

      {records.length === 0 ? (
        <div className="empty-state">
          <p>まだ記録がありません。</p>
          <p className="status-dim">エサをあげると記録が残ります。</p>
        </div>
      ) : (
        <div className="record-list">
          {records.map(rec => (
            <div key={rec.id} className="record-item">
              <div className="record-header">
                <span className="record-icon">
                  {FEED_ICONS[rec.feedCategory as FeedCategory] ?? '📝'}
                </span>
                <div className="record-summary">
                  <span className="record-feed">{rec.feedName}</span>
                  <span className="record-reaction">{rec.reaction}</span>
                </div>
                <span className="record-date">
                  {new Date(rec.createdAt).toLocaleDateString('ja-JP', {
                    month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <Accordion label="ステータス変化">
                <StatusDiff before={rec.beforeStatus} after={rec.afterStatus} />
              </Accordion>
            </div>
          ))}
        </div>
      )}

      <Button onClick={onBack} variant="secondary" fullWidth>もどる</Button>
    </div>
  );
}

function StatusDiff({
  before, after,
}: {
  before: { energy: number; mood: number; health: number; growth: number };
  after:  { energy: number; mood: number; health: number; growth: number };
}): JSX.Element {
  const rows: { label: string; key: keyof typeof before }[] = [
    { label: '元気',   key: 'energy' },
    { label: '機嫌',   key: 'mood'   },
    { label: '健康',   key: 'health' },
    { label: '成長度', key: 'growth' },
  ];
  return (
    <div className="status-diff">
      {rows.map(({ label, key }) => {
        const diff = after[key] - before[key];
        const sign = diff > 0 ? '+' : '';
        const cls  = diff > 0 ? 'diff-up' : diff < 0 ? 'diff-down' : 'diff-zero';
        return (
          <div key={key} className="diff-row">
            <span className="diff-label">{label}</span>
            <span className="diff-before">{before[key]}</span>
            <span className="diff-arrow">→</span>
            <span className="diff-after">{after[key]}</span>
            <span className={`diff-delta ${cls}`}>{sign}{diff}</span>
          </div>
        );
      })}
    </div>
  );
}
