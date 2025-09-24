'use client'

import { type Icon } from '@tabler/icons-react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    badge?: {
      text: string
      variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    }
    isActive?: boolean
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Overview</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={item.isActive}
                className="group"
              >
                <a
                  href={item.url}
                  className="flex items-center gap-3 w-full"
                >
                  {item.icon && (
                    <item.icon className="size-4 shrink-0 transition-colors group-hover:text-sidebar-accent-foreground" />
                  )}
                  <span className="flex-1 truncate">{item.title}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badge.variant || 'secondary'}
                      className="ml-auto h-5 px-1.5 text-xs font-medium"
                    >
                      {item.badge.text}
                    </Badge>
                  )}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
