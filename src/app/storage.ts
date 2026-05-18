// localStorage への保存・読み込み管理
// farm-core-main の utils/storage.ts をベースに拡張

import type { AppState } from './appState';

const STORAGE_KEY = 'local-ai-pixel-farm:v1';

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[storage] 保存失敗:', e);
  }
}

export function loadState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
