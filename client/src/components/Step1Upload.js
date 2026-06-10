import React, { useState } from 'react';
import FileUpload from './FileUpload';

export default function Step1Upload({ cvText, setCvText, jdText, setJdText, onNext }) {
  const [cvMode, setCvMode] = useState('paste'); // 'paste' | 'upload'
  const [jdMode, setJdMode] = useState('paste');

  const canProceed = cvText.trim().length > 50 && jdText.trim().length > 50;

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Upload your documents</h1>
        <p className="text-gray-500 mt-1 text-sm">Paste or upload your CV and the job description to get started.</p>
      </div>

      {/* CV Section */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">Your CV</h2>
            <p className="text-xs text-gray-400">Paste your CV text or upload a file</p>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
            <button
              onClick={() => setCvMode('paste')}
              className={`px-3 py-1.5 font-medium transition-colors ${cvMode === 'paste' ? 'bg-[#1D9E75] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              Paste
            </button>
            <button
              onClick={() => setCvMode('upload')}
              className={`px-3 py-1.5 font-medium transition-colors ${cvMode === 'upload' ? 'bg-[#1D9E75] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              Upload
            </button>
          </div>
        </div>

        {cvMode === 'paste' ? (
          <textarea
            className="input-field h-40"
            placeholder="Paste your full CV here…"
            value={cvText}
            onChange={e => setCvText(e.target.value)}
          />
        ) : (
          <FileUpload onTextExtracted={text => { setCvText(text); }} label="Upload CV (PDF or DOCX)" />
        )}

        {cvText && cvMode === 'upload' && (
          <textarea
            className="input-field h-32 text-xs text-gray-500"
            value={cvText}
            onChange={e => setCvText(e.target.value)}
            placeholder="Extracted text will appear here. You can edit it."
          />
        )}
      </div>

      {/* JD Section */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">Job Description</h2>
            <p className="text-xs text-gray-400">Paste the job description or upload a file</p>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-200 text-xs">
            <button
              onClick={() => setJdMode('paste')}
              className={`px-3 py-1.5 font-medium transition-colors ${jdMode === 'paste' ? 'bg-[#1D9E75] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              Paste
            </button>
            <button
              onClick={() => setJdMode('upload')}
              className={`px-3 py-1.5 font-medium transition-colors ${jdMode === 'upload' ? 'bg-[#1D9E75] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              Upload
            </button>
          </div>
        </div>

        {jdMode === 'paste' ? (
          <textarea
            className="input-field h-40"
            placeholder="Paste the job description here…"
            value={jdText}
            onChange={e => setJdText(e.target.value)}
          />
        ) : (
          <FileUpload onTextExtracted={text => { setJdText(text); }} label="Upload Job Description (PDF or DOCX)" />
        )}

        {jdText && jdMode === 'upload' && (
          <textarea
            className="input-field h-32 text-xs text-gray-500"
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Extracted text will appear here. You can edit it."
          />
        )}
      </div>

      <div className="flex justify-end">
        <button className="btn-primary" disabled={!canProceed} onClick={onNext}>
          Analyse Match →
        </button>
      </div>
    </div>
  );
}
