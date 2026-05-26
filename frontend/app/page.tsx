import WelcomeBanner from './components/WelcomeBanner';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <WelcomeBanner />
      <div className="text-center py-12">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
          Welcome to AI Code Mentor
        </h2>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-lg">
          Your AI-powered coding assistant
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <a href="/chat" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-400 hover:shadow-md transition-all">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Chat</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ask technical questions</p>
          </a>
          <a href="/review" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-400 hover:shadow-md transition-all">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-800 dark:text-white">Code Review</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get AI feedback on your code</p>
          </a>
          <a href="/history" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-400 hover:shadow-md transition-all">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-semibold text-gray-800 dark:text-white">History</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View past sessions</p>
          </a>
        </div>
      </div>
    </div>
  );
}
