'use client'

import { type Row } from '@tanstack/react-table'
import { MoreHorizontal, Edit, Eye, Trash2, UserPlus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useState } from 'react'

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { taskStatuses, taskPriorities } from './task-data'
import { AssignUserDialog } from '../AssignUserDialog'
import { taskApi } from '@/services/taskApi'

import type { Task } from '@/types/task'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onTaskUpdate?: () => void
}

export function DataTableRowActions<TData>({
  row,
  onTaskUpdate,
}: DataTableRowActionsProps<TData>) {
  const task = row.original as Task
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteTask = async () => {
    try {
      setIsDeleting(true)
      await taskApi.deleteTask(task.id)
      toast.success('Task deleted successfully')
      if (onTaskUpdate) {
        onTaskUpdate()
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
      toast.error('Failed to delete task')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
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
        <DropdownMenuItem
          className="gap-2"
          onSelect={(event) => {
            event.preventDefault()
            // Trigger the dialog programmatically
            const dialog = document.querySelector('[data-dialog-trigger="assign-users"]') as HTMLButtonElement
            if (dialog) {
              dialog.click()
            }
          }}
        >
          <UserPlus className="h-4 w-4" />
          Assign Users
        </DropdownMenuItem>
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 className="h-4 w-4" />
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the task
                <strong className="font-medium"> "{task.title}"</strong> and all of its data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteTask}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>

      {/* Hidden dialog trigger */}
      <AssignUserDialog
        task={task}
        onTaskUpdate={onTaskUpdate}
        trigger={
          <Button
            data-dialog-trigger="assign-users"
            className="hidden"
            aria-hidden="true"
          />
        }
      />
    </>
  )
}
