import { type ReactNode } from 'react';

interface Props {
  pageKey: string;
  children: ReactNode;
}

/** Smooth page enter animation when navigating between modules. */
export function PageTransition({ pageKey, children }: Props) {
  return (
    <div key={pageKey} className="page-enter" style={{ minHeight: '100%' }}>
      {children}
    </div>
  );
}
