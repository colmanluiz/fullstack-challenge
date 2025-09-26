import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Edit, ArrowLeft, Clock, Flag, Trash2, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SiteHeader } from '@/components/site-header'
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

import { taskApi } from '@/services/taskApi'
import {
  type Task,
  TASK_STATUSES,
  TASK_PRIORITIES,
  TaskStatus,
} from '@/types/task'
import { AddCommentForm } from '@/components/tasks/AddCommentForm'
import { CommentsList } from '@/components/tasks/CommentsList'
import { TaskHistory } from '@/components/tasks/TaskHistory'
import { SimpleAssigneeDisplay } from '@/components/tasks/SimpleAssigneeDisplay'
import { AssignUserDialog } from '@/components/tasks/AssignUserDialog'

export const Route = createFileRoute('/tasks/$id/')({
  component: TaskDetailPage,
})

function TaskDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentsCount, setCommentsCount] = useState<number>(0)
  const [commentsListKey, setCommentsListKey] = useState<number>(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const fetchTask = async () => {
    try {
      setIsLoading(true)
      console.log('🔄 Fetching task details:', id)
      const taskData = await taskApi.getTask(id)
      setTask(taskData)
      console.log('✅ Task loaded:', taskData.title)
    } catch (err) {
      console.error('❌ Failed to fetch task:', err)
      setError('Failed to load task. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTask()
  }, [id])

  const handleDeleteTask = async () => {
    if (!task) return

    try {
      setIsDeleting(true)
      console.log('🗑️ Deleting task:', task.title)
      await taskApi.deleteTask(task.id)
      console.log('✅ Task deleted successfully')
      navigate({ to: '/tasks' })
    } catch (err) {
      console.error('❌ Failed to delete task:', err)
      setError('Failed to delete task. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCompleteTask = async () => {
    if (!task) return

    try {
      setIsCompleting(true)
      console.log('✅ Marking task as complete:', task.title)
      const updatedTask = await taskApi.updateTask(task.id, {
        status: TaskStatus.DONE,
      })
      setTask(updatedTask)
      console.log('✅ Task marked as complete')
    } catch (err) {
      console.error('❌ Failed to complete task:', err)
      setError('Failed to complete task. Please try again.')
    } finally {
      setIsCompleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading task...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Task
            </h3>
            <p className="text-red-700 mb-4">{error || 'Task not found'}</p>
            <Link to="/tasks">
              <Button variant="outline">Back to Tasks</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getStatusDisplay = (status: string) => {
    return TASK_STATUSES.find((s) => s.value === status)?.label || status
  }

  const getPriorityDisplay = (priority: string) => {
    return TASK_PRIORITIES.find((p) => p.value === priority)?.label || priority
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_review':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'todo':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <>
      <SiteHeader title={`Tasks / ${task?.title || 'Task Details'}`} />
      <div className="container mx-auto py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Navigation and action buttons */}
          <div className="flex items-center justify-between">
            <Link to="/tasks">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Tasks
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              {/* Complete Task Button */}
              {task.status !== TaskStatus.DONE && (
                <Button
                  onClick={handleCompleteTask}
                  disabled={isCompleting}
                  variant="outline"
                  className="gap-2 text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700 hover:border-green-400"
                >
                  {isCompleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {isCompleting ? 'Completing...' : 'Mark Complete'}
                </Button>
              )}

              {/* Edit Button */}
              <Link to="/tasks/$id/edit" params={{ id: task.id }}>
                <Button className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Task
                </Button>
              </Link>

              {/* Assign Users Button */}
              <AssignUserDialog task={task} onTaskUpdate={fetchTask} />

              {/* Delete Button with Confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{task.title}"? This
                      action cannot be undone and will also remove all
                      associated comments.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteTask}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Deleting...
                        </>
                      ) : (
                        'Delete Task'
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Task details card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{task.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Created {new Date(task.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(task.status)}>
                    {getStatusDisplay(task.status)}
                  </Badge>
                  <Badge className={getPriorityColor(task.priority)}>
                    <Flag className="h-3 w-3 mr-1" />
                    {getPriorityDisplay(task.priority)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Description */}
              {task.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              )}

              <Separator />

              {/* Task metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Details</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge
                          variant="outline"
                          className={getStatusColor(task.status)}
                        >
                          {getStatusDisplay(task.status)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(task.priority)}
                        >
                          {getPriorityDisplay(task.priority)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Created:</span>
                        <span>
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Updated:</span>
                        <span>
                          {new Date(task.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignees */}
                <div>
                  <h4 className="font-semibold mb-2">Assignees</h4>
                  <SimpleAssigneeDisplay
                    assignees={task.assignees || []}
                    maxDisplay={10}
                    variant="outline"
                    size="default"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Comments
                {commentsCount > 0 && (
                  <Badge variant="secondary" className="h-5 px-2 text-xs">
                    {commentsCount}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Collaborate on this task with your team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add comment form */}
              <AddCommentForm
                taskId={id}
                onCommentAdded={() => {
                  setCommentsListKey((prev) => prev + 1)
                }}
              />

              <Separator />

              {/* Comments list */}
              <CommentsList
                key={commentsListKey}
                taskId={id}
                onCommentsLoad={(count) => setCommentsCount(count)}
              />
            </CardContent>
          </Card>

          {/* Task History section */}
          <TaskHistory taskId={id} />
        </div>
      </div>
    </>
  )
}
