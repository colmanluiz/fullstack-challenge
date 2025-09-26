'use client'

import { type Row } from '@tanstack/react-table'
import { MoreHorizontal, Edit, Eye, Trash2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { taskStatuses, taskPriorities } from './task-data'

import type { Task } from '@/types/task'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const task = row.original as Task

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="data-[state=open]:bg-muted size-8"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <Link to="/tasks/$id" params={{ id: task.id }}>
          <DropdownMenuItem className="gap-2">
            <Eye className="h-4 w-4" />
            View
          </DropdownMenuItem>
        </Link>
        <Link to="/tasks/$id/edit" params={{ id: task.id }}>
          <DropdownMenuItem className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.status}>
              {taskStatuses.map((status) => (
                <DropdownMenuRadioItem key={status.value} value={status.value}>
                  <div className="flex items-center gap-2">
                    {status.icon && <status.icon className="h-4 w-4" />}
                    {status.label}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Priority</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={task.priority}>
              {taskPriorities.map((priority) => (
                <DropdownMenuRadioItem key={priority.value} value={priority.value}>
                  <div className="flex items-center gap-2">
                    {priority.icon && <priority.icon className="h-4 w-4" />}
                    {priority.label}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
          <Trash2 className="h-4 w-4" />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
