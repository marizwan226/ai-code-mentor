import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="text-center py-20">
        <h2 className="text-4xl font-bold text-gray-800">
          Welcome to AI Code Mentor
        </h2>
        <p className="mt-4 text-gray-500 text-lg">
          Your AI-powered coding assistant
        </p>
      </div>
    </Layout>
  );
}