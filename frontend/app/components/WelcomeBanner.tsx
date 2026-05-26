'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WelcomeBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('welcome_dismissed');
    if (!dismissed) setShow(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('welcome_dismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="mb-6 rounded-xl border border-indigo-700 bg-indigo-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-indigo-900 border-b border-indigo-700">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👋</span>
          <div>
            <h2 className="text-white font-bold text-lg">Welcome to AI Code Mentor!</h2>
            <p className="text-indigo-300 text-sm">Your AI-powered coding assistant. Here is how to get started:</p>
          </div>
        </div>
        <button
          onClick={dismiss}
          className="text-indigo-300 hover:text-white transition-colors text-xl"
          title="Dismiss"
        >
          ✕
        </button>
      </div>

      {/* Quick Start Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        <Link
          href="/chat"
          className="flex flex-col items-center gap-3 bg-indigo-900 hover:bg-indigo-800 border border-indigo-700 rounded-xl p-4 transition-colors group"
        >
          <span className="text-3xl">💬</span>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">Ask a Question</p>
            <p className="text-indigo-300 text-xs mt-1">Chat with your AI mentor about any coding topic</p>
          </div>
          <span className="text-indigo-400 group-hover:text-white text-xs transition-colors">
            Go to Chat →
          </span>
        </Link>

        <Link
          href="/review"
          className="flex flex-col items-center gap-3 bg-indigo-900 hover:bg-indigo-800 border border-indigo-700 rounded-xl p-4 transition-colors group"
        >
          <span className="text-3xl">🔍</span>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">Review Your Code</p>
            <p className="text-indigo-300 text-xs mt-1">Paste code and get instant AI feedback</p>
          </div>
          <span className="text-indigo-400 group-hover:text-white text-xs transition-colors">
            Go to Review →
          </span>
        </Link>

        <Link
          href="/review"
          className="flex flex-col items-center gap-3 bg-indigo-900 hover:bg-indigo-800 border border-indigo-700 rounded-xl p-4 transition-colors group"
        >
          <span className="text-3xl">💡</span>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">Explain Code</p>
            <p className="text-indigo-300 text-xs mt-1">Understand any code snippet in plain English</p>
          </div>
          <span className="text-indigo-400 group-hover:text-white text-xs transition-colors">
            Go to Explain →
          </span>
        </Link>
      </div>

      {/* Dismiss */}
      <div className="px-6 pb-4 flex justify-end">
        <button
          onClick={dismiss}
          className="text-xs text-indigo-400 hover:text-indigo-200 transition-colors"
        >
          Don't show this again
        </button>
      </div>
    </div>
  );
}