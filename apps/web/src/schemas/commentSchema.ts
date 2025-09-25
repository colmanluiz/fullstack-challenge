import { z } from 'zod'

export const commentFormSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be less than 1000 characters'),
})

export type CommentFormData = z.infer<typeof commentFormSchema>

export const defaultCommentValues: CommentFormData = {
  content: '',
}
