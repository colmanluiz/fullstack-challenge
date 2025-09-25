import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { TaskForm } from '@/components/tasks/TaskForm'
import { taskApi } from '@/services/taskApi'
import type { Task } from '@/types/task'

export const Route = createFileRoute('/tasks/$id/edit')({
  component: EditTaskPage,
})

function EditTaskPage() {
  const { id } = Route.useParams()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Later we'll replace this with TanStack Query
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setIsLoading(true)
        console.log('🔄 Fetching task for edit:', id)
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

    fetchTask()
  }, [id])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="max-w-2xl mx-auto">
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Task
            </h3>
            <p className="text-red-700 mb-4">{error || 'Task not found'}</p>
            <button
              onClick={() => window.history.back()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <TaskForm
        mode="edit"
        task={task}
        onSuccess={() => {
          console.log('✅ Task updated successfully, navigating back...')
          window.location.href = `/tasks/${id}`
        }}
      />
    </div>
  )
}
