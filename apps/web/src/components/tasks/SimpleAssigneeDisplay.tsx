import { Badge } from '@/components/ui/badge'
import type { TaskAssignee } from '@/types/task'

interface SimpleAssigneeDisplayProps {
  assignees: TaskAssignee[]
  maxDisplay?: number
  variant?: 'default' | 'secondary' | 'outline'
  size?: 'sm' | 'default'
}

export function SimpleAssigneeDisplay({
  assignees,
  maxDisplay = 3,
  variant = 'secondary',
  size = 'sm'
}: SimpleAssigneeDisplayProps) {
  if (!assignees || assignees.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">No assignees</span>
    )
  }

  const displayedAssignees = assignees.slice(0, maxDisplay)
  const remainingCount = assignees.length - maxDisplay

  return (
    <div className="flex flex-wrap gap-1">
      {displayedAssignees.map((assignee) => (
        <Badge
          key={assignee.id}
          variant={variant}
          className={size === 'sm' ? 'text-xs px-2 py-0' : ''}
        >
          {size === 'sm' ? assignee.username.split('_')[0].substring(0, 8) : assignee.username}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge
          variant="outline"
          className={size === 'sm' ? 'text-xs px-2 py-0' : ''}
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  )
}