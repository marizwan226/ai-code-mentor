'use client';
import API_URL from '../config/api';

import { useState, useEffect } from 'react';

interface Session {
  sessionId: string;
  type: string;
  language: string;
  title: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

interface FullSession extends Session {
  messages: Message[];
}

const TYPE_ICONS: Record<string, string> = {
  chat: '💬',
  review: '🔍',
  explain: '💡'
};

const TYPE_COLORS: Record<string, string> = {
  chat: 'bg-indigo-900 text-indigo-300 border-indigo-700',
  review: 'bg-blue-900 text-blue-300 border-blue-700',
  explain: 'bg-emerald-900 text-emerald-300 border-emerald-700'
};

export default function History() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<FullSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('${API_URL}/api/sessions');
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {
      setError('Failed to load sessions. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSession = async (sessionId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/sessions/${sessionId}`);
      const data = await res.json();
      setSelectedSession(data.session);
    } catch {
      setError('Failed to load session.');
    }
  };

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`${API_URL}/api/sessions/${sessionId}`, {
        method: 'DELETE'
      });
      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
      if (selectedSession?.sessionId === sessionId) {
        setSelectedSession(null);
      }
    } catch {
      setError('Failed to delete session.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Session History</h2>
          <p className="text-gray-500 mt-1">View and revisit your past code reviews and chats</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            ❌ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-700 text-sm">
                  Sessions ({sessions.length})
                </h3>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="animate-spin text-2xl mb-2">⏳</div>
                  Loading sessions...
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="text-4xl mb-2">📭</div>
                  No sessions yet. Start a chat or code review!
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {sessions.map((session) => (
                    <div
                      key={session.sessionId}
                      onClick={() => fetchSession(session.sessionId)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedSession?.sessionId === session.sessionId ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[session.type] || TYPE_COLORS.chat}`}>
                              {TYPE_ICONS[session.type] || '💬'} {session.type}
                            </span>
                            {session.language !== 'unknown' && (
                              <span className="text-xs text-gray-400">{session.language}</span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {session.title}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {session.preview}
                          </p>
                          <p className="text-xs text-gray-300 mt-1">
                            {formatDate(session.updatedAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => deleteSession(session.sessionId, e)}
                          className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0 p-1"
                          title="Delete session"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Session Detail */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-700">{selectedSession.title}</h3>
                    <p className="text-xs text-gray-400">{formatDate(selectedSession.updatedAt)}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[selectedSession.type] || TYPE_COLORS.chat}`}>
                    {TYPE_ICONS[selectedSession.type]} {selectedSession.type}
                  </span>
                </div>

                <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
                  {selectedSession.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                          message.role === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                          {message.content}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 h-64 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">👈</div>
                  <p>Select a session to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
</div>
  );
}