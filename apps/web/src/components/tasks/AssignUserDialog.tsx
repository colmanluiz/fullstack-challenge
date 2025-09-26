import { useState, useEffect } from 'react'
import { UserPlus } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UserSelect } from './UserSelect'
import { taskApi } from '@/services/taskApi'

import type { Task } from '@/types/task'

interface AssignUserDialogProps {
  task: Task
  onAssignmentComplete?: () => void
  onTaskUpdate?: () => void // New callback to refresh task data
  trigger?: React.ReactNode
}

export function AssignUserDialog({ task, onAssignmentComplete, onTaskUpdate, trigger }: AssignUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<Array<string>>([])
  const [isAssigning, setIsAssigning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAssignUsers = async () => {
    if (selectedUsers.length === 0) return

    try {
      setIsAssigning(true)
      setError(null)

      // Assign each selected user to the task
      const assignmentPromises = selectedUsers.map(userId =>
        taskApi.createTaskAssignment({ taskId: task.id, userId })
      )

      await Promise.all(assignmentPromises)

      console.log('✅ Users assigned successfully')

      // Call both callbacks to refresh data
      if (onAssignmentComplete) {
        onAssignmentComplete()
      }
      if (onTaskUpdate) {
        onTaskUpdate() // Refresh task data to get updated assignees
      }

      // Reset form and close dialog
      setSelectedUsers([])
      setOpen(false)
    } catch (err) {
      console.error('❌ Failed to assign users:', err)
      setError('Failed to assign users. Please try again.')
    } finally {
      setIsAssigning(false)
    }
  }

  const currentAssigneeIds = task.assignees?.map(assignee => assignee.id) || []
  const availableUsers = (userId: string) => !currentAssigneeIds.includes(userId)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Assign Users
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Users to Task</DialogTitle>
          <DialogDescription>
            Select users to assign to "{task.title}". They will receive notifications about this task.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current assignees */}
          {task.assignees && task.assignees.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Currently Assigned:</h4>
              <div className="flex flex-wrap gap-2">
                {task.assignees.map(assignee => (
                  <div key={assignee.id} className="text-xs bg-muted px-2 py-1 rounded">
                    {assignee.username}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User selection */}
          <div>
            <h4 className="text-sm font-medium mb-2">Assign New Users:</h4>
            <UserSelect
              selectedUsers={selectedUsers}
              onSelectionChange={setSelectedUsers}
              placeholder="Select users to assign..."
              maxSelections={5}
              excludeUserIds={currentAssigneeIds} // Exclude already assigned users
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded border">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignUsers}
            disabled={selectedUsers.length === 0 || isAssigning}
            className="gap-2"
          >
            {isAssigning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Assigning...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Assign {selectedUsers.length} User{selectedUsers.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}