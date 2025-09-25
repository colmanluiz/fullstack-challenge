import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),

  description: z
    .string()
    .optional(),

  deadline: z
    .string()
    .min(1, 'Deadline is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Please enter a valid date',
    }),

  status: z.enum(['todo', 'in_progress', 'in_review', 'done'] as const).optional(),

  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const).optional(),
})

export type TaskFormData = z.infer<typeof taskFormSchema>

export const defaultTaskValues: TaskFormData = {
  title: '',
  description: '',
  deadline: '',
  status: 'todo',
  priority: 'medium',
}
