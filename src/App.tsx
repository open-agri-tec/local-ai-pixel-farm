// アプリルート
// 画面ルーティングと状態管理の起点

import { useCallback, useState } from 'react';
import { useAppState } from './app/appState';
import { NavButtons } from './components/NavButtons';
import { HomeScreen } from './screens/HomeScreen';
import { EggCreateScreen } from './screens/EggCreateScreen';
import { FeedCreateScreen } from './screens/FeedCreateScreen';
import { FeedScreen } from './screens/FeedScreen';
import { RecordScreen } from './screens/RecordScreen';
import type { Feed } from './feed/FeedModel';

export function App(): JSX.Element {
  const {
    state,
    currentMonster,
    navigate,
    addMonster,
    updateMonster,
    addFeed,
    addRecord,
  } = useAppState();

  const { currentScreen, feeds, records } = state;
  const hasMonster = currentMonster !== null;
  const [pendingFeed, setPendingFeed] = useState<Feed | null>(null);

  // エサ一覧から選んだエサを HomeScreen に渡し、既存の給餌シーケンスで再生する
  const handleFeedFromList = useCallback((feed: Feed) => {
    if (!currentMonster) return;
    setPendingFeed(feed);
    navigate('home');
  }, [currentMonster, navigate]);

  const clearPendingFeed = useCallback(() => {
    setPendingFeed(null);
  }, []);

  const handleFeedCreate = useCallback((feed: Feed) => {
    addFeed(feed);
    navigate('home');
  }, [addFeed, navigate]);

  // モンスターが1体もいなければ必ずEgg作成画面
  if (!hasMonster || currentScreen === 'egg') {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">ローカルAI育成ファーム</h1>
        </header>
        <main className="app-main">
          <EggCreateScreen onComplete={addMonster} />
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">ローカルAI育成ファーム</h1>
      </header>

      <main className="app-main">
        {currentScreen === 'home' && (
          <HomeScreen
            monster={currentMonster}
            onMonsterUpdate={updateMonster}
            onRecordAdd={addRecord}
            pendingFeed={pendingFeed}
            onPendingFeedConsumed={clearPendingFeed}
            onGoFeed={() => navigate('feed')}
            onGoCreate={() => navigate('feedCreate')}
          />
        )}

        {currentScreen === 'feed' && (
          <FeedScreen
            feeds={feeds}
            isFeeding={false}
            onFeed={handleFeedFromList}
            onGoCreate={() => navigate('feedCreate')}
            onBack={() => navigate('home')}
          />
        )}

        {currentScreen === 'feedCreate' && (
          <FeedCreateScreen
            onComplete={handleFeedCreate}
            onBack={() => navigate('home')}
          />
        )}

        {currentScreen === 'records' && (
          <RecordScreen
            records={records}
            onBack={() => navigate('home')}
          />
        )}
      </main>

      <footer className="app-footer">
        <NavButtons
          current={currentScreen}
          onNavigate={navigate}
          hasMonster={hasMonster}
        />
      </footer>
    </div>
  );
}

export default App;
