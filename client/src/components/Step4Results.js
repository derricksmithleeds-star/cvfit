import React, { useState } from 'react';

function DocumentPreview({ title, content, filename }) {
  const [downloading, setDownloading] = useState(false);
  const [tab, setTab] = useState('preview');

  async function download() {
    setDownloading(true);
    try {
      const res = await fetch('/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, filename }),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename + '.docx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
        <button
          className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
          onClick={download}
          disabled={downloading}
        >
          {downloading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Downloading…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download DOCX
            </>
          )}
        </button>
      </div>

      <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs w-fit">
        <button
          onClick={() => setTab('preview')}
          className={`px-3 py-1.5 font-medium transition-colors ${tab === 'preview' ? 'bg-[#1D9E75] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
        >
          Preview
        </button>
        <button
          onClick={() => setTab('raw')}
          className={`px-3 py-1.5 font-medium transition-colors ${tab === 'raw' ? 'bg-[#1D9E75] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
        >
          Raw Text
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        {tab === 'preview' ? (
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {content}
          </div>
        ) : (
          <textarea
            className="w-full h-80 text-xs text-gray-600 bg-transparent resize-none outline-none font-mono"
            readOnly
            value={content}
          />
        )}
      </div>
    </div>
  );
}

export default function Step4Results({ results, onStartOver }) {
  if (!results) return null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <div className="w-14 h-14 bg-[#1D9E75]/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Your tailored documents are ready</h1>
        <p className="text-gray-500 text-sm mt-1">Download your rewritten CV and cover letter below.</p>
      </div>

      <DocumentPreview
        title="Tailored CV"
        content={results.tailoredCV}
        filename="tailored_cv"
      />

      <DocumentPreview
        title="Cover Letter"
        content={results.coverLetter}
        filename="cover_letter"
      />

      <div className="text-center pt-2">
        <button className="btn-secondary" onClick={onStartOver}>
          ← Start with a new role
        </button>
      </div>
    </div>
  );
}
