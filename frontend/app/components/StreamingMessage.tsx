'use client';

import { useState, useEffect, useRef } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import CopyButton from './CopyButton';

interface StreamingMessageProps {
  content: string;
  isStreaming: boolean;
  onStop?: () => void;
}

export default function StreamingMessage({ content, isStreaming, onStop }: StreamingMessageProps) {
  const [showCursor, setShowCursor] = useState(true);
  const cursorRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isStreaming) {
      cursorRef.current = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
    } else {
      if (cursorRef.current) clearInterval(cursorRef.current);
      setShowCursor(false);
    }

    return () => {
      if (cursorRef.current) clearInterval(cursorRef.current);
    };
  }, [isStreaming]);

  return (
    <div className="relative">
      <MarkdownRenderer content={content} />

      {/* Typing cursor */}
      {isStreaming && (
        <span
          className={`inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 align-middle transition-opacity duration-100 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Controls */}
      <div className="flex items-center gap-2 mt-3">
        {isStreaming && onStop && (
          <button
            onClick={onStop}
            className="flex items-center gap-1.5 text-xs bg-red-900 hover:bg-red-800 text-red-200 px-3 py-1.5 rounded-md border border-red-700 transition-colors"
          >
            ⏹ Stop generating
          </button>
        )}
        {!isStreaming && content && (
          <CopyButton text={content} label="Copy response" />
        )}
      </div>
    </div>
  );
}