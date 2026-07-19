export default function TransactionSkeleton() {
  return (
    <div className="card" style={{
      padding: '14px 16px', marginBottom: 8, borderLeft: '4px solid var(--border)',
      animation: 'pulse 2s infinite',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--border)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 14, width: 160, background: 'var(--border)', borderRadius: 4, marginBottom: 8 }} />
          <div style={{ height: 12, width: 120, background: 'var(--border)', borderRadius: 4 }} />
        </div>
        <div style={{ height: 20, width: 80, background: 'var(--border)', borderRadius: 4 }} />
      </div>
    </div>
  )
}
