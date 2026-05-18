// アプリの初期状態定義
// AppState 型は appState.ts にあるが、循環依存を避けるためここでは型なしで定義

export const INITIAL_APP_STATE = {
  monsters:         [] as [],
  currentMonsterId: null as null,
  feeds:            [] as [],
  records:          [] as [],
  currentScreen:    'home' as const,
};
