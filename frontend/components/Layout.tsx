import React from 'react';

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
            <a href="/" className="text-gray-600 hover:text-indigo-600">Home</a>
            <a href="/chat" className="text-gray-600 hover:text-indigo-600">Chat</a>
            <a href="/review" className="text-gray-600 hover:text-indigo-600">Review</a>
            <a href="/history" className="text-gray-600 hover:text-indigo-600">History</a>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}