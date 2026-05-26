'use client';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code block
      if (line.startsWith('```')) {
        const lang = line.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <div key={i} className="my-3 rounded-lg overflow-hidden border border-gray-700">
            {lang && (
              <div className="bg-gray-800 px-3 py-1 text-xs text-gray-400 font-mono border-b border-gray-700">
                {lang}
              </div>
            )}
            <pre className="bg-gray-950 p-4 overflow-x-auto text-sm text-green-300 font-mono leading-relaxed">
              {codeLines.join('\n')}
            </pre>
          </div>
        );
        i++;
        continue;
      }

      // Heading
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-base font-bold text-white mt-3 mb-1">{line.slice(4)}</h3>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-lg font-bold text-white mt-4 mb-2">{line.slice(3)}</h2>);
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-xl font-bold text-white mt-4 mb-2">{line.slice(2)}</h1>);
      }
      // Bullet list
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={i} className="ml-4 text-gray-300 text-sm list-disc">
            {renderInline(line.slice(2))}
          </li>
        );
      }
      // Numbered list
      else if (/^\d+\.\s/.test(line)) {
        elements.push(
          <li key={i} className="ml-4 text-gray-300 text-sm list-decimal">
            {renderInline(line.replace(/^\d+\.\s/, ''))}
          </li>
        );
      }
      // Bold section header
      else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
        elements.push(
          <p key={i} className="font-bold text-white mt-3 mb-1 text-sm">
            {line.slice(2, -2)}
          </p>
        );
      }
      // Empty line
      else if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />);
      }
      // Regular paragraph
      else {
        elements.push(
          <p key={i} className="text-gray-300 text-sm leading-relaxed">
            {renderInline(line)}
          </p>
        );
      }

      i++;
    }

    return elements;
  };

  const renderInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-gray-800 text-yellow-300 px-1.5 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-0.5">
      {renderContent(content)}
    </div>
  );
}