'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/chat', label: 'Chat', icon: '💬' },
  { href: '/review', label: 'Code Review', icon: '🔍' },
  { href: '/history', label: 'History', icon: '📋' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-700 z-30
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="text-white font-bold text-lg">AI Code Mentor</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white lg:hidden"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700">

          {/* Theme Toggle */}
          <div className="px-3 pt-3">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                {resolvedTheme === 'dark' ? '☀️' : '🌙'}
                {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
              <span className={`w-8 h-4 rounded-full transition-colors ${resolvedTheme === 'dark' ? 'bg-indigo-600' : 'bg-gray-600'}`}>
                <span className={`block w-3 h-3 bg-white rounded-full mt-0.5 transition-transform ${resolvedTheme === 'dark' ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </span>
            </button>
          </div>

          {/* Profile */}
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                M
              </div>
              <div>
                <p className="text-white text-sm font-medium">Mariz</p>
                <p className="text-gray-400 text-xs">Developer</p>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}