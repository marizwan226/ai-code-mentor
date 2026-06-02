'use client';
import API_URL from '../config/api';
import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import StreamingMessage from './StreamingMessage';
import ExamplePrompts from './ExamplePrompts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const getTimestamp = () => {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Code Mentor. Ask me anything about code — bugs, best practices, architecture, or anything technical.',
      timestamp: getTimestamp()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleNewConversation = () => {
    handleStop();
    setMessages([{
      role: 'assistant',
      content: 'New conversation started! How can I help you with your code today?',
      timestamp: getTimestamp()
    }]);
    setSessionId('');
    setInput('');
    setStreamingContent('');
    setIsStreaming(false);
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (streamingContent) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: streamingContent,
        timestamp: getTimestamp()
      }]);
    }
    setStreamingContent('');
    setIsStreaming(false);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: getTimestamp()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setStreamingContent('');
    setIsStreaming(false);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch(`${API_URL}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          sessionId: sessionId || undefined
        }),
        signal: abortControllerRef.current.signal
      });

      if (res.status === 429) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '⚠️ Too many requests. Please wait a moment before sending another message.',
          timestamp: getTimestamp()
        }]);
        return;
      }

      if (!res.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '❌ Something went wrong. Please try again.',
          timestamp: getTimestamp()
        }]);
        return;
      }

      // Handle SSE streaming
      setIsStreaming(true);
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setMessages(prev => [...prev, {
                  role: 'assistant',
                  content: fullContent,
                  timestamp: getTimestamp()
                }]);
                setStreamingContent('');
                setIsStreaming(false);
                return;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullContent += parsed.text;
                  setStreamingContent(fullContent);
                }
                if (parsed.sessionId) {
                  setSessionId(parsed.sessionId);
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }
        }
      }

    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Failed to connect to the server. Make sure the backend is running.',
        timestamp: getTimestamp()
      }]);
    } finally {
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-950 rounded-xl border border-gray-700 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white font-semibold text-sm">AI Code Mentor</span>
          <span className="text-gray-500 text-xs">— Senior Developer Mode</span>
        </div>
        <button
          onClick={handleNewConversation}
          className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white px-3 py-1.5 rounded-md border border-gray-600 transition-colors"
        >
          🔄 New Conversation
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}

        {/* Example Prompts — shown only on first message */}
        {messages.length === 1 && !loading && (
          <ExamplePrompts onSelect={(prompt) => {
            setInput(prompt);
            textareaRef.current?.focus();
          }} />
        )}

        {/* Streaming message */}
        {(isStreaming || streamingContent) && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold mr-2 flex-shrink-0 mt-1">
              AI
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[75%]">
              <StreamingMessage
                content={streamingContent}
                isStreaming={isStreaming}
                onStop={handleStop}
              />
            </div>
          </div>
        )}

        {/* Loading dots */}
        {loading && !isStreaming && !streamingContent && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold mr-2">
              AI
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 bg-gray-900 border-t border-gray-700">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a technical question... (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 bg-gray-800 text-white placeholder-gray-500 border border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none max-h-32 overflow-y-auto"
          />
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex-shrink-0"
          >
            {loading ? (
              <span className="text-sm">⏳</span>
            ) : (
              <span className="text-sm">➤</span>
            )}
          </button>
        </div>
        <p className="text-gray-600 text-xs mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}