'use client'

import {
  IconChecklist,
  IconUser,
  IconUsers,
  IconPlus,
  IconDots,
  IconEdit,
  IconCopy,
  IconFilter,
} from '@tabler/icons-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'

export function NavTasks() {
  const { isMobile } = useSidebar()

  const taskViews = [
    {
      name: 'My Tasks',
      url: '/tasks?filter=assigned-to-me',
      icon: IconUser,
      count: 12,
      description: 'Tasks assigned to me'
    },
    {
      name: 'All Tasks',
      url: '/tasks',
      icon: IconChecklist,
      count: 47,
      description: 'All project tasks'
    },
    {
      name: 'Team Tasks',
      url: '/tasks?filter=team',
      icon: IconUsers,
      count: 23,
      description: 'Tasks assigned to my team'
    }
  ]

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Tasks</SidebarGroupLabel>
      <SidebarMenu>
        {taskViews.map((view) => (
          <SidebarMenuItem key={view.name}>
            <SidebarMenuButton asChild>
              <a href={view.url} title={view.description}>
                <view.icon className="size-4" />
                <span>{view.name}</span>
                <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                  {view.count}
                </Badge>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="data-[state=open]:bg-accent rounded-sm"
                >
                  <IconDots className="size-4" />
                  <span className="sr-only">More options for {view.name}</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem>
                  <IconFilter className="size-4" />
                  <span>Filter & Sort</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconCopy className="size-4" />
                  <span>Copy View Link</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconEdit className="size-4" />
                  <span>Customize View</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}

        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            <IconPlus className="size-4" />
            <span>New Task</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
