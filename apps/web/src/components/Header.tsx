import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="border-b bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-bold">
            TaskManager
          </Link>
          <nav className="flex space-x-4">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Tasks
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {/* Auth buttons will go here */}
        </div>
      </div>
    </header>
  )
}
