interface Reference {
  title: string;
  url: string;
  accessed?: string;
  authors?: string;
  year?: number;
  note?: string;
}

function renderItem(ref: Reference | string, i: number) {
  if (typeof ref === 'string') {
    return <li key={i}>{ref}</li>;
  }
  const meta: string[] = [];
  if (ref.authors) meta.push(ref.authors);
  if (ref.year) meta.push(String(ref.year));
  const metaStr = meta.join(', ');
  return (
    <li key={i}>
      <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.title}</a>
      {metaStr && <span style={{ color: 'var(--sl-color-gray-3)' }}> — {metaStr}</span>}
      {ref.note && <span style={{ color: 'var(--sl-color-gray-2)', fontStyle: 'italic' }}> · {ref.note}</span>}
      {ref.accessed && <span style={{ color: 'var(--sl-color-gray-3)' }}> (접근: {ref.accessed})</span>}
    </li>
  );
}

export default function References({ items }: { items: (Reference | string)[] }) {
  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--sl-color-gray-5)', paddingTop: '1rem' }}>
      <h4>참고 자료</h4>
      <ul style={{ fontSize: '0.9rem' }}>
        {items.map(renderItem)}
      </ul>
    </div>
  );
}
