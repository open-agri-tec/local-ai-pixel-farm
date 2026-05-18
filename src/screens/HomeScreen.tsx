// ホーム画面
// モンスター表示・エサやり操作の起点
// 給餌シーケンス管理はここで行うが、処理本体は MonsterController に委譲する

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Monster, MonsterMood, AnimationKind, FoodPhase } from '../monster/MonsterModel';
import type { FeedCategory } from '../feed/FeedModel';
import type { FarmRecord } from '../records/RecordModel';
import { MonsterRenderer } from '../monster/MonsterRenderer';
import { StatusPanel } from '../components/StatusPanel';
import { FeedButtons } from '../components/FeedButtons';
import { Button } from '../components/Button';
import { runFeedSequence, type FeedingUIState } from '../monster/MonsterController';
import { analyzeFeed } from '../brain/LocalBrain';
import { createFeed } from '../feed/feedFactory';
import { createRecord } from '../records/recordStore';

interface HomeScreenProps {
  monster:      Monster;
  onMonsterUpdate: (m: Monster) => void;
  onRecordAdd:  (r: FarmRecord) => void;
  onGoFeed:     () => void;
  onGoCreate:   () => void;
}

const INITIAL_UI: FeedingUIState = {
  mood:              'neutral',
  message:           '',
  action:            'idle',
  actionStartedAt:   0,
  foodKind:          null,
  foodPhase:         'none',
  foodPhaseStartedAt: 0,
};

export function HomeScreen({
  monster, onMonsterUpdate, onRecordAdd, onGoFeed, onGoCreate,
}: HomeScreenProps): JSX.Element {
  const [ui, setUI] = useState<FeedingUIState>(INITIAL_UI);
  const timerIdsRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timerIdsRef.current.forEach(id => clearTimeout(id));
    timerIdsRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number): number => {
    const id = window.setTimeout(() => {
      timerIdsRef.current = timerIdsRef.current.filter(t => t !== id);
      fn();
    }, delay);
    timerIdsRef.current.push(id);
    return id;
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const isFeeding = ui.foodPhase !== 'none';

  // カテゴリを直接受けてエサやり（クイックフィード）
  const handleQuickFeed = useCallback((category: FeedCategory) => {
    if (isFeeding) return;
    clearTimers();

    const feed     = createFeed({ name: category, category });
    const analysis = analyzeFeed(monster, feed);
    const beforeStatus = { ...monster.status };

    runFeedSequence({
      monster,
      reaction:     analysis.reaction,
      feedCategory: category,
      schedule,
      setUI: updater => setUI(prev => updater(prev)),
      onComplete: (updated) => {
        onMonsterUpdate(updated);
        const rec = createRecord({
          monster,
          feed,
          reaction:     analysis.reaction.message,
          action:       analysis.reaction.animation,
          beforeStatus,
          afterStatus:  updated.status,
        });
        onRecordAdd(rec);
      },
    });
  }, [isFeeding, monster, clearTimers, schedule, onMonsterUpdate, onRecordAdd]);

  return (
    <div className="screen home-screen">
      {/* モンスター名・作物情報 */}
      <div className="home-monster-header">
        <span className="home-monster-name">{monster.name}</span>
        {monster.crop.name && (
          <span className="home-crop-badge">{monster.crop.name}</span>
        )}
      </div>

      {/* Canvas */}
      <div className="canvas-frame">
        <MonsterRenderer
          stage={monster.stage}
          mood={ui.mood}
          action={ui.action as AnimationKind}
          actionStartedAt={ui.actionStartedAt}
          foodKind={ui.foodKind}
          foodPhase={ui.foodPhase as FoodPhase}
          foodPhaseStartedAt={ui.foodPhaseStartedAt}
        />
      </div>

      {/* ステータス */}
      <StatusPanel
        monster={monster}
        mood={ui.mood as MonsterMood}
        message={ui.message}
      />

      {/* クイックエサやり（農業カテゴリボタン） */}
      <FeedButtons onFeed={handleQuickFeed} disabled={isFeeding} />

      {/* エサ一覧からあげる */}
      <div className="btn-row">
        <Button onClick={onGoFeed} variant="secondary" fullWidth disabled={isFeeding}>
          エサ一覧からあげる
        </Button>
        <Button onClick={onGoCreate} variant="secondary" fullWidth disabled={isFeeding}>
          エサを作る
        </Button>
      </div>
    </div>
  );
}
