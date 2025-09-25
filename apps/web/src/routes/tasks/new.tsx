import { createFileRoute } from '@tanstack/react-router'
import { TaskForm } from '@/components/tasks/TaskForm'

export const Route = createFileRoute('/tasks/new')({
  component: NewTaskPage,
})

function NewTaskPage() {
  return (
    <div className="container mx-auto py-6">
      <TaskForm mode="create" />
    </div>
  )
}
