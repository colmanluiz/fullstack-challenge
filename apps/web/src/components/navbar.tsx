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
    <header className="px-4 md:px-6 bg-[#fbfbfb] dark:bg-[#0f0f0f]">
      <div className="flex h-16 items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex flex-1 items-center gap-2">
          {/* Mobile menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => {
                    const Icon = link.icon
                    return (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className="flex-row items-center gap-2 py-1.5"
                          active={link.active}
                        >
                          <Icon
                            size={16}
                            className="text-muted-foreground/80"
                            aria-hidden="true"
                          />
                          <span>{link.label}</span>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
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
