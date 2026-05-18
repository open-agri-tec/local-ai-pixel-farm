// アコーディオンコンポーネント
// 詳細情報の折りたたみに使う

import { useState } from 'react';

interface AccordionProps {
  label:    string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ label, children, defaultOpen = false }: AccordionProps): JSX.Element {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="accordion">
      <button
        type="button"
        className={`accordion-trigger ${open ? 'accordion-open' : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <span>{label}</span>
        <span className="accordion-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}
