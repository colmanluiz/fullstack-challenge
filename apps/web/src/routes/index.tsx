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

  return <div>teste</div>
}
