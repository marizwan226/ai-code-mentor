import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">
            AI Code Mentor
          </h1>
          <div className="flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
            <Link href="/chat" className="text-gray-600 hover:text-indigo-600">Chat</Link>
            <Link href="/review" className="text-gray-600 hover:text-indigo-600">Review</Link>
            <Link href="/history" className="text-gray-600 hover:text-indigo-600">History</Link>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}