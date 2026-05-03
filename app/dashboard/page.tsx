'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Real Estate Investment Calculator
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to Your Dashboard
              </h2>
              <p className="text-gray-600">
                Calculator functionality coming soon...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
