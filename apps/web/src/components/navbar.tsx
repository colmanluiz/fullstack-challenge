import { useId } from 'react'
import { LayoutDashboard, LucideListTodo, SearchIcon } from 'lucide-react'

import Logo from '@/components/navbar-components/logo'
import NotificationMenu from '@/components/navbar-components/notification-menu'
import UserMenu from '@/components/navbar-components/user-menu'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import ThemeToggle from './navbar-components/theme-toggle'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { Input } from './ui/input'

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { href: '/tasks', label: 'Tasks', icon: LucideListTodo },
]

export default function Navbar() {
  const { isAuthenticated, user, isLoading } = useAuth()
  const id = useId()

  return (
    <header className="px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="text-primary hover:text-primary/90">
              <Logo />
            </a>
          </div>
        </div>
        {/* Middle area */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="relative">
            <Input
              id={id}
              className="peer h-8 ps-8 pe-2"
              placeholder="Search..."
              type="search"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
          </div>
        </div>
        {/* Right side */}
        {user && isAuthenticated ? (
          <div className="flex items-center justify-end gap-4">
            {/* Notification */}
            <NotificationMenu />
            {/* User menu */}
            <UserMenu />
            <ThemeToggle />
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <Button asChild variant="ghost" size="sm" className="text-sm">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="text-sm">
              <Link to="/register">Register</Link>
            </Button>
            <ThemeToggle />
          </div>
        )}
      </div>
    </header>
  )
}
