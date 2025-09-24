import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth()

  // 📚 LEARNING: Show different content based on authentication state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Welcome to TaskManager
        </h1>

        {isAuthenticated && user ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              🎉 You're logged in!
            </h2>
            <p className="text-green-700">
              Welcome back, <strong>{user.username}</strong>!
            </p>
            <p className="text-sm text-green-600 mt-2">
              Email: {user.email}
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                🚀 Ready to build your task management interface!
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Get Started
            </h2>
            <p className="text-blue-700 mb-4">
              Please log in or create an account to manage your tasks.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                📝 Your AuthContext is working!
              </p>
              <p className="text-sm text-gray-600">
                🔗 Ready for login/register pages
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p>Authentication State: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
          <p>Loading: {isLoading ? '⏳ Loading' : '✅ Ready'}</p>
        </div>
      </div>
    </div>
  )
}
