import React, { useState } from 'react';
import { apiUrl } from '../api';

export default function Step3Questions({ gaps, gapAnswers, setGapAnswers, cvText, jdText, setResults, onNext, onBack }) {
  const [answers, setAnswers] = useState(() => {
    const init = {};
    gaps.forEach(g => { init[g.id] = { hasExperience: null, detail: '' }; });
    return init;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function setYesNo(id, val) {
    setAnswers(prev => ({ ...prev, [id]: { ...prev[id], hasExperience: val } }));
  }

  function setDetail(id, val) {
    setAnswers(prev => ({ ...prev, [id]: { ...prev[id], detail: val } }));
  }

  const allAnswered = gaps.every(g => answers[g.id]?.hasExperience !== null);

  async function handleSubmit() {
    setLoading(true);
    setError('');
    const gapAnswersList = gaps.map(g => ({
      skill: g.skill,
      hasExperience: answers[g.id]?.hasExperience ?? false,
      detail: answers[g.id]?.detail || '',
    }));
    setGapAnswers(gapAnswersList);

    try {
      const res = await fetch(apiUrl('/tailor'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, jdText, gapAnswers: gapAnswersList }),
      });
      if (!res.ok) throw new Error('Tailoring failed');
      const data = await res.json();
      setResults(data);
      onNext();
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (gaps.length === 0) {
    return (
      <div className="card text-center py-10">
        <p className="text-gray-600 font-medium">No gaps found — your CV already looks great for this role!</p>
        <button className="btn-primary mt-4" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Tailoring…' : 'Tailor my CV →'}
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Tell us about your experience</h1>
        <p className="text-gray-500 text-sm mt-1">Answer these questions so we can accurately tailor your CV.</p>
      </div>

      {gaps.map((gap, i) => (
        <div key={gap.id} className="card space-y-4">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 text-xs font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <p className="text-gray-800 font-medium text-sm leading-relaxed">{gap.question}</p>
          </div>

          <div className="flex gap-3 ml-9">
            <button
              onClick={() => setYesNo(gap.id, true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors ${
                answers[gap.id]?.hasExperience === true
                  ? 'bg-[#1D9E75] border-[#1D9E75] text-white'
                  : 'border-gray-200 text-gray-600 hover:border-[#1D9E75] hover:text-[#1D9E75]'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setYesNo(gap.id, false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors ${
                answers[gap.id]?.hasExperience === false
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500'
              }`}
            >
              No
            </button>
          </div>

          {answers[gap.id]?.hasExperience === true && (
            <div className="ml-9">
              <p className="text-xs text-gray-500 mb-1.5">{gap.detail}</p>
              <textarea
                className="input-field h-20 text-sm"
                placeholder="Describe your experience briefly…"
                value={answers[gap.id].detail}
                onChange={e => setDetail(gap.id, e.target.value)}
              />
            </div>
          )}
        </div>
      ))}

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="flex justify-between">
        <button className="btn-secondary" onClick={onBack} disabled={loading}>← Back</button>
        <button className="btn-primary" onClick={handleSubmit} disabled={!allAnswered || loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Tailoring your CV…
            </span>
          ) : 'Tailor my CV →'}
        </button>
      </div>
    </div>
  );
}
