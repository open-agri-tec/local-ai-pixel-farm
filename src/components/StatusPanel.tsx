// モンスターの状態値・成長段階・反応メッセージを表示するパネル
// pixel-monster-lab の StatusPanel.tsx から移植・農業ステータス対応に拡張

import type { Monster, MonsterMood } from '../monster/MonsterModel';
import { STAGE_LABELS, STAGE_THRESHOLDS, getStageProgress } from '../monster/monsterGrowth';
import { MOOD_LABELS } from '../monster/monsterActions';
import { Accordion } from './Accordion';

interface StatusPanelProps {
  monster: Monster;
  mood:    MonsterMood;
  message: string;
}

export function StatusPanel({ monster, mood, message }: StatusPanelProps): JSX.Element {
  const { status, stage } = monster;
  const progress    = getStageProgress(status.growth);
  const stageName   = STAGE_LABELS[stage];
  const nextThresh  = STAGE_THRESHOLDS[stage];
  const isMax       = stage === 7;

  return (
    <div className="status-panel">
      {/* メッセージ */}
      <div className="status-message">
        {message || `${monster.name}はのんびりしている。`}
      </div>

      {/* 成長プログレス */}
      <div className="status-row">
        <span className="status-label">成長</span>
        <span className="status-value">
          Stage {stage} / {stageName}
          {!isMax && <span className="status-dim">（あと {Math.max(0, nextThresh - status.growth)}）</span>}
        </span>
      </div>
      <div className="status-progress">
        <div className="status-progress-bar" style={{ width: `${progress * 100}%` }} />
      </div>

      {/* 気分 */}
      <div className="status-row">
        <span className="status-label">気分</span>
        <span className={`status-value mood-${mood}`}>{MOOD_LABELS[mood]}</span>
      </div>

      {/* 詳細ステータス（アコーディオン） */}
      <Accordion label="詳細ステータス">
        <div className="status-detail-grid">
          <StatusBar label="元気"  value={status.energy} />
          <StatusBar label="機嫌"  value={status.mood}   />
          <StatusBar label="健康"  value={status.health} />
        </div>
        {monster.crop.name && (
          <div className="status-crop-info">
            <span className="status-dim">作物：</span>{monster.crop.name}
            {monster.crop.field && <span className="status-dim">（{monster.crop.field}）</span>}
          </div>
        )}
      </Accordion>
    </div>
  );
}

function StatusBar({ label, value }: { label: string; value: number }): JSX.Element {
  const pct = Math.max(0, Math.min(100, value));
  const color = pct >= 70 ? '#3dba74' : pct >= 40 ? '#f5a623' : '#e05555';
  return (
    <div className="status-bar-row">
      <span className="status-bar-label">{label}</span>
      <div className="status-bar-track">
        <div className="status-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="status-bar-val">{value}</span>
    </div>
  );
}
