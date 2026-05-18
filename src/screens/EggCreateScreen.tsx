// タマゴ作成画面
// 初回起動時（モンスターが1体もいないとき）に表示される

import { useState } from 'react';
import type { Monster } from '../monster/MonsterModel';
import { DEFAULT_STATUS, DEFAULT_CROP } from '../monster/MonsterModel';
import { getStageFromGrowth } from '../monster/monsterGrowth';
import { CROP_CATEGORIES, type CropCategory } from '../data/categoryList';
import { Button } from '../components/Button';

interface EggCreateScreenProps {
  onComplete: (monster: Monster) => void;
}

let _id = 0;
function genId() { return `monster_${Date.now()}_${++_id}`; }

export function EggCreateScreen({ onComplete }: EggCreateScreenProps): JSX.Element {
  const [name,     setName]     = useState('');
  const [cropName, setCropName] = useState('');
  const [field,    setField]    = useState('');
  const [category, setCategory] = useState<CropCategory>('蔬菜');

  const handleCreate = () => {
    const now = new Date().toISOString();
    const monster: Monster = {
      id:   genId(),
      name: name.trim() || 'なまえなしモンスター',
      crop: {
        ...DEFAULT_CROP,
        name:     cropName.trim(),
        field:    field.trim(),
        category,
      },
      status:          { ...DEFAULT_STATUS },
      stage:           getStageFromGrowth(DEFAULT_STATUS.growth),
      currentAction:   'idle',
      actionStartedAt: 0,
      lastReaction:    '',
      foodKind:        null,
      foodPhase:       'none',
      foodPhaseStartedAt: 0,
      createdAt: now,
      updatedAt: now,
    };
    onComplete(monster);
  };

  return (
    <div className="screen egg-screen">
      <h2 className="screen-title">🥚 タマゴを作る</h2>
      <p className="screen-desc">モンスターに名前と担当作物を教えてください。</p>

      <div className="form-group">
        <label className="form-label">モンスターの名前</label>
        <input
          className="form-input"
          type="text"
          placeholder="例：ブロッコリーうさぎ"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={20}
        />
      </div>

      <div className="form-group">
        <label className="form-label">作物名</label>
        <input
          className="form-input"
          type="text"
          placeholder="例：ブロッコリー"
          value={cropName}
          onChange={e => setCropName(e.target.value)}
          maxLength={20}
        />
      </div>

      <div className="form-group">
        <label className="form-label">ほ場名</label>
        <input
          className="form-input"
          type="text"
          placeholder="例：露地A"
          value={field}
          onChange={e => setField(e.target.value)}
          maxLength={20}
        />
      </div>

      <div className="form-group">
        <label className="form-label">作物カテゴリ</label>
        <div className="category-grid">
          {CROP_CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              className={`category-btn ${category === cat ? 'category-btn-active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleCreate} fullWidth size="lg">
        タマゴをつくる
      </Button>
    </div>
  );
}
