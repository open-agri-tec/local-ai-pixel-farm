// ナビゲーションボタン群（画面下部のメインナビ）

import type { Screen } from '../app/appState';

interface NavButtonsProps {
  current:   Screen;
  onNavigate: (screen: Screen) => void;
  hasMonster: boolean;
}

const NAV_ITEMS: { screen: Screen; label: string; icon: string }[] = [
  { screen: 'home',       label: 'ホーム',   icon: '🏠' },
  { screen: 'feed',       label: 'エサやり', icon: '🌿' },
  { screen: 'feedCreate', label: 'エサ作成', icon: '✏️' },
  { screen: 'records',    label: '記録',     icon: '📋' },
];

export function NavButtons({ current, onNavigate, hasMonster }: NavButtonsProps): JSX.Element {
  return (
    <nav className="nav-buttons">
      {NAV_ITEMS.map(({ screen, label, icon }) => (
        <button
          key={screen}
          type="button"
          className={`nav-btn ${current === screen ? 'nav-btn-active' : ''}`}
          onClick={() => onNavigate(screen)}
          disabled={!hasMonster && screen !== 'home'}
        >
          <span className="nav-icon">{icon}</span>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
