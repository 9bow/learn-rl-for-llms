import { useState, useEffect } from 'react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export default function Quiz({ section }: { section: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/quiz/${section}.json`)
      .then((res) => res.json())
      .then((data: QuizQuestion[]) => setQuestions(data))
      .catch(() => setQuestions([]));
  }, [section]);

  if (questions.length === 0) return <p>퀴즈를 불러오는 중...</p>;

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.answer) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setShowResult(false);
  };

  const handleReset = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div style={{ border: '1px solid var(--sl-color-gray-5)', borderRadius: '0.5rem', padding: '1.5rem', margin: '1rem 0' }}>
        <h3 style={{ marginTop: 0 }}>퀴즈 완료!</h3>
        <p style={{ fontSize: '1.25rem' }}>
          {questions.length}문제 중 <strong>{score}</strong>문제 정답 ({Math.round((score / questions.length) * 100)}%)
        </p>
        <button onClick={handleReset} style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem', border: '1px solid var(--sl-color-gray-5)', cursor: 'pointer', background: 'var(--sl-color-accent)' }}>
          다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid var(--sl-color-gray-5)', borderRadius: '0.5rem', padding: '1.5rem', margin: '1rem 0' }}>
      <p style={{ fontSize: '0.875rem', color: 'var(--sl-color-gray-3)' }}>
        문제 {current + 1} / {questions.length}
      </p>
      <h4 style={{ marginTop: '0.5rem' }}>{q.question}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {q.options.map((opt, idx) => {
          let bg = 'transparent';
          if (showResult && idx === q.answer) bg = 'rgba(0,200,80,0.15)';
          else if (showResult && idx === selected && idx !== q.answer) bg = 'rgba(255,60,60,0.15)';
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                textAlign: 'left',
                padding: '0.75rem',
                border: '1px solid var(--sl-color-gray-5)',
                borderRadius: '0.25rem',
                cursor: showResult ? 'default' : 'pointer',
                background: bg,
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontWeight: 600 }}>
            {selected === q.answer ? '정답입니다!' : '오답입니다.'}
          </p>
          <p style={{ color: 'var(--sl-color-gray-3)' }}>{q.explanation}</p>
          <button onClick={handleNext} style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.25rem', border: '1px solid var(--sl-color-gray-5)', cursor: 'pointer' }}>
            {current + 1 >= questions.length ? '결과 보기' : '다음 문제'}
          </button>
        </div>
      )}
    </div>
  );
}
