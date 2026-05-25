import CodeEditor from '../components/CodeEditor';

export default function Review() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Code Review</h2>
      <p className="text-gray-500 mb-6">Paste or upload your code for an AI-powered review.</p>
      <CodeEditor />
    </div>
  );
}