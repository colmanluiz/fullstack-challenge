import {
  commentFormSchema,
  defaultCommentValues,
  type CommentFormData,
} from '@/schemas/commentSchema'
import { taskApi } from '@/services/taskApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'

interface AddCommentFormProps {
  taskId: string
  onCommentAdded?: () => void
}

export function AddCommentForm({
  taskId,
  onCommentAdded,
}: AddCommentFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: defaultCommentValues,
  })

  const onSubmit = async (data: CommentFormData) => {
    setIsLoading(true)

    try {
      console.log('🔄 Creating new comment...', data)
      const newComment = await taskApi.createComment({
        content: data.content,
        taskId,
      })

      console.log('✅ Task created successfully:', newComment.id)

      form.reset()

      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (error) {
      console.error('❌ Comment operation failed:', error)
      // TODO: Show error toast to user
      // For now, we'll just log the error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add a comment..."
                  className="min-h-[80px] resize-none border-border/50 focus:border-border bg-background text-foreground"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading || !form.watch('content')?.trim()}
            size="sm"
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send size={16} />
                Comment
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
