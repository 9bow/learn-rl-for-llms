interface Reference {
  title: string;
  url: string;
  accessed?: string;
}

export default function References({ items }: { items: Reference[] }) {
  return (
    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--sl-color-gray-5)', paddingTop: '1rem' }}>
      <h4>참고 자료</h4>
      <ul style={{ fontSize: '0.9rem' }}>
        {items.map((ref, i) => (
          <li key={i}>
            <a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.title}</a>
            {ref.accessed && <span style={{ color: 'var(--sl-color-gray-3)' }}> (접근: {ref.accessed})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
