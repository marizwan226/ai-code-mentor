'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import LanguageSelector from './LanguageSelector';
import FileUpload from './FileUpload';
import ReviewResponse from './ReviewResponse';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// Renamed interface to avoid conflict with ReviewResponse component
interface ReviewData {
  response: string;
  sessionId: string;
}

const MONACO_LANGUAGE_MAP: Record<string, string> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  sql: 'sql',
  java: 'java',
  go: 'go',
  cpp: 'cpp',
  bash: 'shell',
  auto: 'plaintext'
};

export default function CodeEditor() {
  const [code, setCode] = useState('# Paste your code here...');
  const [language, setLanguage] = useState('auto');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState('');

  const detectLanguage = useCallback(async (codeSnippet: string) => {
    if (codeSnippet.length < 10) return;
    try {
      const res = await fetch('http://localhost:5000/api/chat/detect-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeSnippet })
      });
      const data = await res.json();
      if (data.language && data.language !== 'unknown') {
        setDetectedLanguage(data.name);
      }
    } catch {
      // Silent fail for detection
    }
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    if (language === 'auto' && newCode.length > 20) {
      detectLanguage(newCode);
    }
  };

  const handleFileLoad = (content: string, filename: string) => {
    setCode(content);
    const ext = filename.split('.').pop()?.toLowerCase();
    const extToLang: Record<string, string> = {
      py: 'python', js: 'javascript', ts: 'typescript',
      sql: 'sql', java: 'java', go: 'go', cpp: 'cpp', sh: 'bash'
    };
    if (ext && extToLang[ext]) {
      setLanguage(extToLang[ext]);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim() || code === '# Paste your code here...') {
      setError('Please enter some code to review.');
      return;
    }

    setLoading(true);
    setError('');
    setReview('');

    try {
      const langContext = language !== 'auto' ? language : detectedLanguage || 'unknown';
      const prompt = `Please review this ${langContext !== 'unknown' ? langContext : ''} code:\n\n\`\`\`\n${code}\n\`\`\``;

      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          sessionId: sessionId || undefined
        })
      });

      if (res.status === 429) {
        setError('Too many requests. Please wait a moment before trying again.');
        return;
      }

      if (!res.ok) {
        setError('Something went wrong. Please try again.');
        return;
      }

      const data: ReviewData = await res.json();
      setReview(data.response);
      setSessionId(data.sessionId);

    } catch {
      setError('Failed to connect to the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const monacoLang = MONACO_LANGUAGE_MAP[language] || 'plaintext';

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-gray-900 p-3 rounded-lg border border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-white text-sm font-medium">Language:</span>
          <LanguageSelector
            selected={language}
            detected={detectedLanguage}
            onSelect={setLanguage}
          />
        </div>
        <FileUpload onFileLoad={handleFileLoad} />
      </div>

      {/* Editor */}
      <div className="rounded-lg overflow-hidden border border-gray-700" style={{ height: '400px' }}>
        <MonacoEditor
          height="400px"
          language={monacoLang}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            lineNumbers: 'on',
            automaticLayout: true,
            padding: { top: 16 }
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {loading ? '⏳ Reviewing...' : '🔍 Submit for Review'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      {/* Review Result */}
      {review && (
        <ReviewResponse
          response={review}
          language={language !== 'auto' ? language : detectedLanguage}
        />
      )}
    </div>
  );
}