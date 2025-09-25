import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  taskFormSchema,
  type TaskFormData,
  defaultTaskValues,
} from '@/schemas/taskSchema'
import { TASK_STATUSES, TASK_PRIORITIES, type Task } from '@/types/task'
import { taskApi } from '@/services/taskApi'

interface TaskFormProps {
  mode: 'create' | 'edit'
  task?: Task // Only provided in edit mode
  onSuccess?: () => void // Callback after successful submission
}

export function TaskForm({ mode, task, onSuccess }: TaskFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || '',
          deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
          status: task.status,
          priority: task.priority,
        }
      : defaultTaskValues,
  })

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true)

    try {
      if (mode === 'create') {
        console.log('🔄 Creating new task...', data)
        const newTask = await taskApi.createTask({
          title: data.title,
          description: data.description || undefined,
          deadline: new Date(data.deadline).toISOString(),
          status: data.status as any,
          priority: data.priority as any,
        })
        console.log('✅ Task created successfully:', newTask.id)
      } else if (mode === 'edit' && task) {
        console.log('🔄 Updating task...', task.id, data)
        const updatedTask = await taskApi.updateTask(task.id, {
          title: data.title,
          description: data.description || undefined,
          deadline: new Date(data.deadline).toISOString(),
          status: data.status as any,
          priority: data.priority as any,
        })
        console.log('✅ Task updated successfully:', updatedTask.id)
      }

      if (onSuccess) {
        onSuccess()
      } else {
        // default behavior: navigate to tasks list
        navigate({ to: '/tasks' })
      }
    } catch (error) {
      console.error('❌ Task operation failed:', error)
      // TODO: Show error toast to user
      // For now, we'll just log the error
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (task) {
      navigate({ to: '/tasks/$id', params: { id: task.id } })
    } else {
      navigate({ to: '/tasks' })
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === 'create' ? 'Create New Task' : 'Edit Task'}
          </CardTitle>
          <CardDescription>
            {mode === 'create'
              ? 'Fill in the details below to create a new task.'
              : 'Update the task information below.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter task description (optional)..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Deadline Field */}
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline *</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        placeholder="Select deadline..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Field */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TASK_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Priority Field */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TASK_PRIORITIES.map((priority) => (
                            <SelectItem
                              key={priority.value}
                              value={priority.value}
                            >
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading
                    ? mode === 'create'
                      ? 'Creating...'
                      : 'Updating...'
                    : mode === 'create'
                      ? 'Create Task'
                      : 'Update Task'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
