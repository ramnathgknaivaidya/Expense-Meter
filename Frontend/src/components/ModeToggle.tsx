interface Props {
  mode: 'income' | 'expense';
  onChange: (mode: 'income' | 'expense') => void;
}

/**
 * Large animated Income | Expenditure toggle (Document §1.2)
 * - Smooth transition animation
 * - Active tab highlight
 * - Green theme for Income / Red-orange for Expense
 */
export function ModeToggle({ mode, onChange }: Props) {
  return (
    <div
      className={`toggle-switch ${mode === 'expense' ? 'expense-mode' : 'income-mode'}`}
      role="tablist"
      aria-label="Financial overview mode"
    >
      <span className="toggle-thumb" aria-hidden />
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'income'}
        className={mode === 'income' ? 'active income' : ''}
        onClick={() => onChange('income')}
      >
        Income
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'expense'}
        className={mode === 'expense' ? 'active expense' : ''}
        onClick={() => onChange('expense')}
      >
        Expenditure
      </button>
    </div>
  );
}
