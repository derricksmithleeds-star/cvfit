import React, { useRef, useState } from 'react';

export default function FileUpload({ onTextExtracted, label, placeholder }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  async function handleFile(file) {
    if (!file) return;
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx)$/i)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }
    setError('');
    setLoading(true);
    setFileName(file.name);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/parse', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Failed to parse file');
      const data = await res.json();
      onTextExtracted(data.text);
    } catch (e) {
      setError('Could not read file. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        className={`upload-zone rounded-xl p-6 text-center cursor-pointer ${dragging ? 'drag-over' : ''}`}
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={e => handleFile(e.target.files[0])}
        />
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-[#1D9E75]">
            <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm font-medium">Parsing file…</span>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-1 text-[#1D9E75]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-semibold">{fileName}</span>
            <span className="text-xs text-gray-400">Click to replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm font-medium text-gray-500">{label || 'Drop file here or click to browse'}</span>
            <span className="text-xs">PDF or DOCX</span>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
