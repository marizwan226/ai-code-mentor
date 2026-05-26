'use client';

interface ExamplePromptsProps {
  onSelect: (prompt: string) => void;
}

const EXAMPLE_PROMPTS = [
  {
    icon: '🐛',
    title: 'Debug my code',
    prompt: 'Why is my code throwing an error? Here is the error: TypeError: Cannot read property of undefined',
    color: 'border-red-700 bg-red-950 hover:bg-red-900'
  },
  {
    icon: '⚡',
    title: 'Optimize performance',
    prompt: 'How can I make this loop more efficient? I have a nested for loop that runs slowly on large datasets.',
    color: 'border-yellow-700 bg-yellow-950 hover:bg-yellow-900'
  },
  {
    icon: '📚',
    title: 'Explain a concept',
    prompt: 'Can you explain how async/await works in JavaScript and when I should use it instead of promises?',
    color: 'border-blue-700 bg-blue-950 hover:bg-blue-900'
  }
];

export default function ExamplePrompts({ onSelect }: ExamplePromptsProps) {
  return (
    <div className="mt-8">
      <p className="text-gray-500 text-sm text-center mb-4">
        Not sure where to start? Try one of these:
      </p>
      <div className="grid grid-cols-1 gap-3">
        {EXAMPLE_PROMPTS.map((example, index) => (
          <button
            key={index}
            onClick={() => onSelect(example.prompt)}
            className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-colors ${example.color}`}
          >
            <span className="text-2xl flex-shrink-0">{example.icon}</span>
            <div>
              <p className="text-white font-medium text-sm">{example.title}</p>
              <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{example.prompt}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}