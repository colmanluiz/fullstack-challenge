import { Link, createLazyFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { getColumns } from '@/components/tasks/components/columns'
import { DataTable } from '@/components/tasks/components/data-table'
import { SiteHeader } from '@/components/site-header'
import { taskApi } from '@/services/taskApi'

import type { Task } from '@/types/task'

export const Route = createLazyFileRoute('/tasks/')({
  component: TasksPage,
})

function TasksPage() {
  const [tasks, setTasks] = useState<Array<Task>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const response = await taskApi.getTasks(1, 50) // Get first 50 tasks

      // Handle different response structures
      let tasksData: Array<Task> = []
      if (Array.isArray(response)) {
        // If response is directly an array
        tasksData = response
      } else if (response && Array.isArray(response.data)) {
        // If response has data property (actual API structure)
        tasksData = response.data
      } else {
        console.warn('Unexpected API response structure:', response)
        tasksData = []
      }

      setTasks(tasksData)
      setError(null) // Clear any previous errors
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
      setError('Failed to load tasks. Please try again.')
      toast.error('Failed to load tasks')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <>
        <SiteHeader title="Tasks" />
        <div className="h-full flex-1 flex-col gap-8 p-8 md:flex">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Welcome back!
              </h2>
              <p className="text-muted-foreground">Loading your tasks...</p>
            </div>
          </div>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading tasks...</span>
          </div>
        </div>
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <>
        <SiteHeader title="Tasks" />
        <div className="h-full flex-1 flex-col gap-8 p-8 md:flex">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Welcome back!
              </h2>
              <p className="text-muted-foreground">
                There was an issue loading your tasks.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-destructive mb-2">{error}</p>
            <p className="text-sm text-muted-foreground mb-4">
              Please check your connection and try again.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </>
    )
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <>
        <SiteHeader title="Tasks" />
        <div className="h-full flex-1 flex-col gap-8 p-8 md:flex">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Welcome back!
              </h2>
              <p className="text-muted-foreground">
                You don&apos;t have any tasks yet. Create your first task to get
                started.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-lg border border-dashed p-8">
              <h3 className="text-lg font-medium mb-2">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first task.
              </p>
              <Link to="/tasks/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create your first task
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Main content
  return (
    <>
      <SiteHeader title="Tasks" />
      <div className="h-full flex-1 flex-col gap-8 p-8 md:flex">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Welcome back!
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month.
              {tasks.length > 0 && ` (${tasks.length} total)`}
            </p>
          </div>
        </div>
        <DataTable data={tasks} columns={getColumns(fetchTasks)} />
      </div>
    </>
  )
}
