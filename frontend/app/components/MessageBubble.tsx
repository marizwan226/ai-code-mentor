'use client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface MessageBubbleProps {
  message: Message;
}

const renderContent = (content: string) => {
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const lines = part.slice(3, -3).split('\n');
      const lang = lines[0].trim();
      const code = lines.slice(1).join('\n');
      return (
        <div key={index} className="my-2 rounded-lg overflow-hidden border border-gray-600">
          <div className="bg-gray-800 px-3 py-1 text-xs text-gray-400 font-mono">
            {lang || 'code'}
          </div>
          <pre className="bg-gray-950 p-3 overflow-x-auto text-sm text-green-300 font-mono leading-relaxed">
            {code}
          </pre>
        </div>
      );
    } else if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="bg-gray-700 text-yellow-300 px-1.5 py-0.5 rounded text-sm font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={index} className="whitespace-pre-wrap">{part}</span>;
  });
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold mr-2 flex-shrink-0 mt-1">
          AI
        </div>
      )}

      {/* Message Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-indigo-600 text-white rounded-tr-sm'
          : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'
      }`}>
        <div className="text-sm leading-relaxed">
          {renderContent(message.content)}
        </div>
        {message.timestamp && (
          <div className={`text-xs mt-1 ${isUser ? 'text-indigo-200' : 'text-gray-500'}`}>
            {message.timestamp}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-bold ml-2 flex-shrink-0 mt-1">
          U
        </div>
      )}
    </div>
  );
}