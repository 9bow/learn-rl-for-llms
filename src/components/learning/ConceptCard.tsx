import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

export default function ConceptCard({ title, children }: Props) {
  return (
    <details className="concept-card">
      <summary>{title}</summary>
      <div style={{ marginTop: '0.5rem' }}>{children}</div>
    </details>
  );
}
