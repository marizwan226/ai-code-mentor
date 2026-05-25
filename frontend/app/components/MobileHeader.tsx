'use client';

interface MobileHeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export default function MobileHeader({ onMenuClick, title = 'AI Code Mentor' }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors"
        aria-label="Open menu"
      >
        <div className="flex flex-col gap-1.5">
          <span className="w-5 h-0.5 bg-current block"></span>
          <span className="w-5 h-0.5 bg-current block"></span>
          <span className="w-5 h-0.5 bg-current block"></span>
        </div>
      </button>
      <span className="text-white font-bold text-lg">🤖 {title}</span>
    </header>
  );
}