import { useEffect, useState } from 'react'
import { taskApi } from '@/services/taskApi'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Frontend comment interface with populated user data
interface CommentWithUser {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    username: string
    email: string
  }
}

interface CommentsListProps {
  taskId: string
  onCommentsLoad?: (count: number) => void
}

export function CommentsList({ taskId, onCommentsLoad }: CommentsListProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🔄 Fetching comments for task:', taskId)
      const response = await taskApi.getTaskComments(taskId)

      console.log('📦 Raw comments data:', response)

      // Handle backend response format: { data: [], meta: {} }
      const commentsArray = (response as any)?.data || []

      // Transform comments to match frontend interface
      const transformedComments: CommentWithUser[] = commentsArray.map(
        (comment: any) => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          user: {
            id: comment.authorId, // authorId on the backend
            username: `User ${comment.authorId.substring(0, 8)}`, // Placeholder username
            email: `user-${comment.authorId.substring(0, 8)}@example.com`, // Placeholder email
          },
        }),
      )

      setComments(transformedComments)
      onCommentsLoad?.(transformedComments.length)

      console.log('✅ Comments loaded:', transformedComments.length)
    } catch (error) {
      console.error('❌ Failed to load comments:', error)
      setError('Failed to load comments')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [taskId])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
      } else {
        return date.toLocaleDateString()
      }
    }
  }

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map((word) => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex gap-3 p-4 rounded-lg bg-muted/20 border border-border/30 animate-pulse"
          >
            <div className="w-8 h-8 bg-muted rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-muted/20 border border-border/50 text-center">
        <p className="text-muted-foreground">{error}</p>
        <button
          onClick={fetchComments}
          className="mt-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="p-8 rounded-lg bg-muted/10 border border-dashed border-border text-center">
        <p className="text-muted-foreground text-sm">
          No comments yet. Be the first to comment!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
        >
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
              {getInitials(comment.user.username)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-foreground">
                {comment.user.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </span>
            </div>

            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
