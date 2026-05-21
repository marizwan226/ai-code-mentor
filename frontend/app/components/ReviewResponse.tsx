'use client';
import NextStepsCard, { parseNextSteps } from './NextStepsCard';

import CopyButton from './CopyButton';

interface ReviewResponseProps {
  response: string;
  language?: string;
}

// Parse response into sections
const parseResponse = (text: string) => {
  const sections = {
    issues: [] as string[],
    improvements: [] as string[],
    good: [] as string[],
    raw: text
  };

  const lines = text.split('\n');
  let currentSection = 'raw';

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("what's wrong") || lower.includes('issues found') || lower.includes('problems')) {
      currentSection = 'issues';
    } else if (lower.includes('improvement') || lower.includes('why it matters') || lower.includes('suggestions')) {
      currentSection = 'improvements';
    } else if (lower.includes("what's good") || lower.includes('the fix') || lower.includes('positives')) {
      currentSection = 'good';
    } else if (line.trim() && currentSection !== 'raw') {
      if (currentSection === 'issues') sections.issues.push(line);
      else if (currentSection === 'improvements') sections.improvements.push(line);
      else if (currentSection === 'good') sections.good.push(line);
    }
  }

  return sections;
};

// Render text with code blocks highlighted
const renderWithCodeBlocks = (text: string) => {
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const lines = part.slice(3, -3).split('\n');
      const lang = lines[0].trim();
      const code = lines.slice(1).join('\n');
      return (
        <div key={index} className="my-3 rounded-lg overflow-hidden border border-gray-700">
          <div className="flex items-center justify-between bg-gray-800 px-3 py-1.5">
            <span className="text-xs text-gray-400 font-mono">{lang || 'code'}</span>
            <CopyButton text={code} label="Copy code" />
          </div>
          <pre className="bg-gray-950 p-4 overflow-x-auto text-sm text-green-300 font-mono leading-relaxed">
            {code}
          </pre>
        </div>
      );
    } else if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="bg-gray-800 text-yellow-300 px-1.5 py-0.5 rounded text-sm font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

// Render a section
const renderSection = (title: string, emoji: string, color: string, content: string) => {
  if (!content.trim()) return null;

  const colorMap: Record<string, string> = {
    red: 'border-red-700 bg-red-950',
    yellow: 'border-yellow-700 bg-yellow-950',
    green: 'border-green-700 bg-green-950',
    blue: 'border-blue-700 bg-blue-950'
  };

  const titleColorMap: Record<string, string> = {
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    blue: 'text-blue-400'
  };

  return (
    <div className={`rounded-lg border p-4 ${colorMap[color]}`}>
      <h4 className={`font-semibold text-sm mb-2 ${titleColorMap[color]}`}>
        {emoji} {title}
      </h4>
      <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
        {renderWithCodeBlocks(content)}
      </div>
    </div>
  );
};

export default function ReviewResponse({ response, language }: ReviewResponseProps) {
  if (!response) return null;

  // Check if response has structured sections
  const hasStructure =
    response.toLowerCase().includes("what's wrong") ||
    response.toLowerCase().includes('issues found') ||
    response.toLowerCase().includes('the fix') ||
    response.toLowerCase().includes('why it matters');

  return (
    <div className="mt-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          🤖 AI Code Review
          {language && (
            <span className="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-700">
              {language}
            </span>
          )}
        </h3>
        <CopyButton text={response} label="Copy review" />
      </div>

      {/* Structured or raw response */}
      {hasStructure ? (
        <div className="space-y-3">
          {renderSection(
            "What's Wrong",
            '❌',
            'red',
            response.split(/improvements|why it matters|the fix|what's good/i)[0]
              .replace(/what's wrong|issues found|problems/i, '').trim()
          )}
          {renderSection(
            'Why It Matters',
            '⚠️',
            'yellow',
            response.split(/why it matters|improvements/i)[1]
              ?.split(/the fix|what's good/i)[0]?.trim() || ''
          )}
          {renderSection(
            'The Fix',
            '✅',
            'green',
            response.split(/the fix/i)[1]?.trim() || ''
          )}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-300 text-sm leading-relaxed">
            {renderWithCodeBlocks(response)}
          </div>
        </div>
      )}
      {/* Next Steps */}
<NextStepsCard steps={parseNextSteps(response)} />
    </div>
  );
}