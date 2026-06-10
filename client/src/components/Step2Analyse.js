import React, { useEffect, useState, useRef } from 'react';
import { apiUrl } from '../api';

function ScoreRing({ score }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#1D9E75' : score >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle
        cx="60" cy="60" r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="60" y="60" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="700" fill={color}>
        {score}%
      </text>
    </svg>
  );
}

export default function Step2Analyse({ cvText, jdText, analysis, setAnalysis, onNext, onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (analysis || hasFetched.current) return;
    hasFetched.current = true;
    setLoading(true);
    fetch(apiUrl('/analyse'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvText, jdText }),
    })
      .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e.error)))
      .then(data => { setAnalysis(data); setLoading(false); })
      .catch(e => { setError(typeof e === 'string' ? e : 'Analysis failed. Please try again.'); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="card text-center py-16">
        <svg className="animate-spin h-12 w-12 text-[#1D9E75] mx-auto mb-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="font-semibold text-gray-700">Analysing your CV…</p>
        <p className="text-sm text-gray-400 mt-1">Comparing your experience against the job requirements</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <p className="text-red-500 font-medium">{error}</p>
        <button className="btn-secondary mt-4" onClick={onBack}>Go Back</button>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Your Match Analysis</h1>
        <p className="text-gray-500 text-sm mt-1">Here's how your CV stacks up against the role.</p>
      </div>

      {/* Score */}
      <div className="card flex flex-col sm:flex-row items-center gap-6">
        <ScoreRing score={analysis.matchScore} />
        <div>
          <h2 className="font-bold text-lg text-gray-800">Match Score</h2>
          <p className="text-gray-500 text-sm mt-1">{analysis.summary}</p>
        </div>
      </div>

      {/* Strengths */}
      {analysis.strengths?.length > 0 && (
        <div className="card space-y-3">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-[#1D9E75]">✓</span> Your Strengths
          </h2>
          <ul className="space-y-2">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-[#1D9E75] mt-0.5 shrink-0">●</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {analysis.gaps?.length > 0 && (
        <div className="card space-y-3">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-amber-500">△</span> Potential Gaps
          </h2>
          <ul className="space-y-2">
            {analysis.gaps.map(g => (
              <li key={g.id} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-amber-400 mt-0.5 shrink-0">●</span>
                {g.skill}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 pt-1">We'll ask you about these in the next step.</p>
        </div>
      )}

      <div className="flex justify-between">
        <button className="btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onNext}>
          {analysis.gaps?.length > 0 ? 'Answer Questions →' : 'Tailor my CV →'}
        </button>
      </div>
    </div>
  );
}
