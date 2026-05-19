'use client';

interface Language {
  key: string;
  name: string;
  badge: string;
}

const LANGUAGES: Language[] = [
  { key: 'auto', name: 'Auto Detect', badge: '🔍' },
  { key: 'python', name: 'Python', badge: '🐍' },
  { key: 'javascript', name: 'JavaScript', badge: '🟨' },
  { key: 'typescript', name: 'TypeScript', badge: '🔷' },
  { key: 'sql', name: 'SQL', badge: '🗄️' },
  { key: 'java', name: 'Java', badge: '☕' },
  { key: 'go', name: 'Go', badge: '🐹' },
  { key: 'cpp', name: 'C++', badge: '⚡' },
  { key: 'bash', name: 'Bash', badge: '💻' },
];

interface LanguageSelectorProps {
  selected: string;
  detected?: string;
  onSelect: (language: string) => void;
}

export default function LanguageSelector({ selected, detected, onSelect }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className="bg-gray-800 text-white border border-gray-600 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.key} value={lang.key}>
            {lang.badge} {lang.name}
          </option>
        ))}
      </select>
      {detected && detected !== 'unknown' && selected === 'auto' && (
        <span className="text-xs bg-indigo-900 text-indigo-300 px-2 py-1 rounded-full border border-indigo-700">
          Detected: {detected}
        </span>
      )}
    </div>
  );
}