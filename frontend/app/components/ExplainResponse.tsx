'use client';

import CopyButton from './CopyButton';

interface ExplainResponseProps {
  explanation: string;
  language?: string;
}

const renderSection = (title: string, emoji: string, color: string, content: string) => {
  if (!content.trim()) return null;

  const colorMap: Record<string, string> = {
    blue: 'border-blue-700 bg-blue-950',
    indigo: 'border-indigo-700 bg-indigo-950',
    green: 'border-green-700 bg-green-950',
  };

  const titleColorMap: Record<string, string> = {
    blue: 'text-blue-400',
    indigo: 'text-indigo-400',
    green: 'text-green-400',
  };

  return (
    <div className={`rounded-lg border p-4 ${colorMap[color]}`}>
      <h4 className={`font-semibold text-sm mb-2 ${titleColorMap[color]}`}>
        {emoji} {title}
      </h4>
      <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
};

export default function ExplainResponse({ explanation, language }: ExplainResponseProps) {
  if (!explanation) return null;

  // Parse sections from explanation
  const overviewMatch = explanation.split(/block.by.block|line.by.line|breakdown/i);
  const summaryMatch = explanation.split(/summary|conclusion|takeaway/i);

  const overview = overviewMatch[0]
    ?.replace(/overview|what this code does/i, '')
    .trim() || '';

  const blockByBlock = overviewMatch[1]
    ?.split(/summary|conclusion|takeaway/i)[0]
    .trim() || '';

  const summary = summaryMatch[summaryMatch.length - 1]?.trim() || '';

  const hasStructure = explanation.toLowerCase().includes('overview') ||
    explanation.toLowerCase().includes('block') ||
    explanation.toLowerCase().includes('summary');

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          💡 Code Explanation
          {language && (
            <span className="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-700">
              {language}
            </span>
          )}
        </h3>
        <CopyButton text={explanation} label="Copy explanation" />
      </div>

      {/* Structured or raw explanation */}
      {hasStructure ? (
        <div className="space-y-3">
          {overview && renderSection('Overview', '🔍', 'blue', overview)}
          {blockByBlock && renderSection('Block-by-Block', '📝', 'indigo', blockByBlock)}
          {summary && renderSection('Summary', '✅', 'green', summary)}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {explanation}
          </div>
        </div>
      )}
    </div>
  );
}