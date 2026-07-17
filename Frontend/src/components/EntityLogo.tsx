export function EntityLogo({ title }: { title: string }) {
  const isGoogle = /google/i.test(title);
  if (isGoogle) {
    return <div className="entity-logo google" aria-hidden title="Google" />;
  }
  const letter = title.trim().charAt(0).toUpperCase() || '?';
  const colors = [
    ['#dbeafe', '#2563eb'],
    ['#d1fae5', '#059669'],
    ['#fce7f3', '#db2777'],
    ['#ede9fe', '#7c3aed'],
    ['#ffedd5', '#ea580c'],
  ];
  const idx = letter.charCodeAt(0) % colors.length;
  const [bg, fg] = colors[idx];
  return (
    <div className="entity-logo" style={{ background: bg, color: fg }} aria-hidden>
      {letter}
    </div>
  );
}
