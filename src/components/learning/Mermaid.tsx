import { useEffect, useRef, useState } from 'react';

interface MermaidProps {
  chart: string;
  caption?: string;
}

export default function Mermaid({ chart, caption }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#4f46e5',
            primaryTextColor: '#e2e8f0',
            primaryBorderColor: '#6366f1',
            lineColor: '#94a3b8',
            secondaryColor: '#1e293b',
            tertiaryColor: '#0f172a',
            fontFamily: 'var(--sl-font)',
          },
        });
        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart.trim());
        if (!cancelled) {
          setSvg(renderedSvg);
        }
      } catch (e) {
        if (!cancelled) {
          setError(String(e));
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    return (
      <pre style={{ color: '#f87171', fontSize: '0.875rem', padding: '1rem', background: '#1e1e2e', borderRadius: '0.5rem' }}>
        {error}
      </pre>
    );
  }

  return (
    <figure style={{ margin: '1.5rem 0', textAlign: 'center' }}>
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: svg }}
        style={{ display: 'flex', justifyContent: 'center', overflow: 'auto' }}
      />
      {caption && (
        <figcaption style={{ color: 'var(--sl-color-gray-3)', fontSize: '0.875rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
