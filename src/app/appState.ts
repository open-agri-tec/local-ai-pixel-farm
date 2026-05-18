// アプリ全体の状態型定義と React フック

import { useCallback, useEffect, useState } from 'react';
import type { Monster } from '../monster/MonsterModel';
import type { Feed } from '../feed/FeedModel';
import type { FarmRecord } from '../records/RecordModel';
import { clearState, loadState, saveState } from './storage';

export type Screen = 'home' | 'egg' | 'feedCreate' | 'feed' | 'records';

export interface AppState {
  monsters:         Monster[];
  currentMonsterId: string | null;
  feeds:            Feed[];
  records:          FarmRecord[];
  currentScreen:    Screen;
}

const INITIAL: AppState = {
  monsters:         [],
  currentMonsterId: null,
  feeds:            [],
  records:          [],
  currentScreen:    'home',
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState() ?? INITIAL);

  // 状態変化のたびに保存
  useEffect(() => {
    saveState(state);
  }, [state]);

  const currentMonster = state.monsters.find(m => m.id === state.currentMonsterId) ?? null;

  const navigate = useCallback((screen: Screen) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
  }, []);

  const addMonster = useCallback((monster: Monster) => {
    setState(prev => ({
      ...prev,
      monsters:         [...prev.monsters, monster],
      currentMonsterId: monster.id,
      currentScreen:    'home',
    }));
  }, []);

  const updateMonster = useCallback((updated: Monster) => {
    setState(prev => ({
      ...prev,
      monsters: prev.monsters.map(m => m.id === updated.id ? updated : m),
    }));
  }, []);

  const addFeed = useCallback((feed: Feed) => {
    setState(prev => ({ ...prev, feeds: [feed, ...prev.feeds] }));
  }, []);

  const addRecord = useCallback((record: FarmRecord) => {
    setState(prev => ({ ...prev, records: [record, ...prev.records] }));
  }, []);

  const resetState = useCallback(() => {
    clearState();
    setState(INITIAL);
  }, []);

  return {
    state,
    currentMonster,
    navigate,
    addMonster,
    updateMonster,
    addFeed,
    addRecord,
    resetState,
  };
}
