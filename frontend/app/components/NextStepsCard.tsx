'use client';

interface Resource {
  title: string;
  url: string;
}

interface NextStep {
  topic: string;
  reason: string;
  resource?: Resource;
}

interface NextStepsCardProps {
  steps: NextStep[];
}

const FREE_RESOURCES: Record<string, Resource> = {
  async: { title: 'MDN: async/await', url: 'https://developer.mozilla.org' },
  promise: { title: 'MDN: Promises', url: 'https://developer.mozilla.org' },
  python: { title: 'Python Docs', url: 'https://docs.python.org/3/' },
  typescript: { title: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/' },
  react: { title: 'React Docs', url: 'https://react.dev' },
  default: { title: 'MDN Web Docs', url: 'https://developer.mozilla.org' }
};

const getResource = (topic: string): Resource => {
  const lower = topic.toLowerCase();
  for (const [key, resource] of Object.entries(FREE_RESOURCES)) {
    if (lower.includes(key)) return resource;
  }
  return FREE_RESOURCES.default;
};

export const parseNextSteps = (text: string): NextStep[] => {
  const section = text.split(/next steps|what to learn|learn next/i)[1];
  if (!section) return [];
  const lines = section.split('\n').filter(line => line.trim());
  const steps: NextStep[] = [];
  for (const line of lines) {
    if (steps.length >= 3) break;
    const cleaned = line.replace(/^[\d.\-*\s]+/, '').trim();
    if (cleaned.length > 10 && cleaned.length < 200) {
      const parts = cleaned.split(':');
      const topic = parts[0]?.trim() || cleaned;
      const reason = parts[1]?.trim() || '';
      steps.push({ topic, reason, resource: getResource(topic) });
    }
  }
  return steps;
};

export default function NextStepsCard({ steps }: NextStepsCardProps) {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="mt-4 rounded-xl border border-amber-700 bg-amber-950 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-amber-900 border-b border-amber-700">
        <span className="text-xl">🎯</span>
        <h4 className="font-semibold text-amber-200 text-sm">What to Learn Next</h4>
        <span className="ml-auto text-xs text-amber-400">
          {steps.length} suggestion{steps.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="divide-y divide-amber-800">
        {steps.map((step, index) => (
          <div key={index} className="px-4 py-3 flex items-start gap-3">
            <span className="text-amber-400 font-bold text-sm flex-shrink-0 mt-0.5">
              {index + 1}.
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-amber-200 font-medium text-sm">{step.topic}</p>
              {step.reason && (
                <p className="text-amber-400 text-xs mt-0.5">{step.reason}</p>
              )}
              <a href={step.resource?.url || '#'} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-300 underline mt-1 inline-block">
                📖 {step.resource?.title || 'Learn more'}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
