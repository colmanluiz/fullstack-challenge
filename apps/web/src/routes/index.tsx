import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: TasksPage,
})

function TasksPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="flex items-center space-x-4">
          {/* Search and create task button will go here */}
        </div>
      </div>

      <div className="space-y-4">
        {/* Task list will go here */}
        <div className="text-center text-muted-foreground py-12">
          <p>No tasks yet. Create your first task to get started!</p>
        </div>
      </div>
    </div>
  )
}
