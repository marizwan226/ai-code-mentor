export default function Settings() {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
      <p className="text-gray-500 mb-6">Manage your preferences and account settings.</p>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Theme</p>
            <p className="text-sm text-gray-500">Choose your preferred theme</p>
          </div>
          <select className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg border border-gray-200">
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </div>
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Language</p>
            <p className="text-sm text-gray-500">Default programming language</p>
          </div>
          <select className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg border border-gray-200">
            <option>Auto Detect</option>
            <option>Python</option>
            <option>JavaScript</option>
            <option>TypeScript</option>
          </select>
        </div>
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Session History</p>
            <p className="text-sm text-gray-500">Maximum sessions to store</p>
          </div>
          <select className="bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-lg border border-gray-200">
            <option>50 sessions</option>
            <option>25 sessions</option>
            <option>10 sessions</option>
          </select>
        </div>
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Version</p>
            <p className="text-sm text-gray-500">AI Code Mentor v1.0</p>
          </div>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
            ✅ Up to date
          </span>
        </div>
      </div>
    </div>
  );
}