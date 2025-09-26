import z from 'zod'

export const taskAssignmentSchema = z.object({
  taskId: z.uuid(),

  userId: z.uuid(),

  assignedAt: z
    .string()
    .min(1, 'assignedAt is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Please enter a valid date',
    }),
})

export type TaskAssignmentData = z.infer<typeof taskAssignmentSchema>

export const defaultTaskAssignmentValues: TaskAssignmentData = {
  taskId: '',
  userId: '',
  assignedAt: '',
}
