'use client'

import {
  IconChecklist,
  IconPlus,
} from '@tabler/icons-react'

import { Link, useRouterState } from '@tanstack/react-router'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavTasks() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const taskViews = [
    {
      name: 'All Tasks',
      url: '/tasks',
      icon: IconChecklist,
      description: 'All project tasks'
    },
    {
      name: 'New Task',
      url: '/tasks/new',
      icon: IconPlus,
      description: 'Create a new task'
    }
  ]

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Tasks</SidebarGroupLabel>
      <SidebarMenu>
        {taskViews.map((view) => {
          const isActive = currentPath === view.url || (view.url === '/tasks' && currentPath.startsWith('/tasks'))
          return (
            <SidebarMenuItem key={view.name}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link to={view.url} title={view.description}>
                  <view.icon className="size-4" />
                  <span>{view.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
