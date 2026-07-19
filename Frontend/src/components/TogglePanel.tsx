import { useEffect, useState, type ReactNode } from 'react';

interface Props {
  mode: 'income' | 'expense';
  children: ReactNode;
  className?: string;
}

/** Dynamic content switching with smooth enter animation when mode changes. */
export function TogglePanel({ mode, children, className = '' }: Props) {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [mode]);

  return (
    <div className={`toggle-panel ${className}`}>
      <div
        key={animKey}
        className={`toggle-panel-inner theme-${mode === 'income' ? 'income' : 'expense'}`}
      >
        {children}
      </div>
    </div>
  );
}
