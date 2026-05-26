'use client';
import API_URL from '../config/api';
import { useTheme } from '../context/ThemeContext';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import LanguageSelector from './LanguageSelector';
import FileUpload from './FileUpload';
import ReviewResponse from './ReviewResponse';
import ExplainResponse from './ExplainResponse';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

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
  const { resolvedTheme } = useTheme();
  const [code, setCode] = useState('# Paste your code here...');
  const [language, setLanguage] = useState('auto');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [review, setReview] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [error, setError] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [activeTab, setActiveTab] = useState<'review' | 'explain'>('review');

  const detectLanguage = useCallback(async (codeSnippet: string) => {
    if (codeSnippet.length < 10) return;
    try {
      const res = await fetch('${API_URL}/api/chat/detect-language', {
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
    setActiveTab('review');

    try {
      const langContext = language !== 'auto' ? language : detectedLanguage || 'unknown';
      const prompt = `Please review this ${langContext !== 'unknown' ? langContext : ''} code:\n\n\`\`\`\n${code}\n\`\`\``;

      const res = await fetch('${API_URL}/api/chat', {
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

  const handleExplain = async () => {
    if (!code.trim() || code === '# Paste your code here...') {
      setError('Please enter some code to explain.');
      return;
    }

    const lineCount = code.split('\n').length;
    if (lineCount > 150) {
      setError('Code explanation supports up to 150 lines. Please trim your code.');
      return;
    }

    setExplaining(true);
    setError('');
    setExplanation('');
    setActiveTab('explain');

    try {
      const langContext = language !== 'auto' ? language : detectedLanguage || 'unknown';
      const prompt = `Please explain this ${langContext !== 'unknown' ? langContext : ''} code line by line in plain English:\n\n\`\`\`\n${code}\n\`\`\``;

      const res = await fetch('${API_URL}/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          sessionId: sessionId || undefined
        })
      });

      if (!res.ok) {
        setError('Something went wrong. Please try again.');
        return;
      }

      const data: ReviewData = await res.json();
      setExplanation(data.response);
      setSessionId(data.sessionId);

    } catch {
      setError('Failed to connect to the server. Make sure the backend is running.');
    } finally {
      setExplaining(false);
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
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
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

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={loading || explaining}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? '⏳ Reviewing...' : '🔍 Submit for Review'}
        </button>
        <button
          onClick={handleExplain}
          disabled={loading || explaining}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {explaining ? '⏳ Explaining...' : '💡 Explain Code'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      {/* Tabs */}
      {(review || explanation) && (
        <div className="flex gap-2 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('review')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'review'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            🔍 Review
          </button>
          <button
            onClick={() => setActiveTab('explain')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'explain'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            💡 Explain
          </button>
        </div>
      )}

      {/* Review Result */}
      {review && activeTab === 'review' && (
        <ReviewResponse
          response={review}
          language={language !== 'auto' ? language : detectedLanguage}
        />
      )}

      {/* Explain Result */}
      {explanation && activeTab === 'explain' && (
        <ExplainResponse
          explanation={explanation}
          language={language !== 'auto' ? language : detectedLanguage}
        />
      )}
    </div>
  );
}