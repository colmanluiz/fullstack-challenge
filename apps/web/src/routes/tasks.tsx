import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { columns } from '@/components/tasks/components/columns'
import { DataTable } from '@/components/tasks/components/data-table'
import { UserNav } from '@/components/tasks/components/user-nav'
import { taskSchema } from '@/components/tasks/data/schema'

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
})

// Import the task data directly
import tasksData from '@/components/tasks/data/tasks.json'

function TasksPage() {
  const tasks = z.array(taskSchema).parse(tasksData)

  return (
    <div className="h-full flex-1 flex-col gap-8 p-8 md:flex">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Welcome back!
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks for this month.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <UserNav />
        </div>
      </div>
      <DataTable data={tasks} columns={columns} />
    </div>
  )
}
