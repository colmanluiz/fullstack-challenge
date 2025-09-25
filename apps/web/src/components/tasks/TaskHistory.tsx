import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Edit, Plus, Trash2, User } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline'
import { taskApi } from '@/services/taskApi'

import type { TaskHistory } from '@/types/task'

interface TaskHistoryProps {
  taskId: string
}

export function TaskHistory({ taskId }: TaskHistoryProps) {
  const [history, setHistory] = useState<Array<TaskHistory>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
      case 'created':
        return Plus
      case 'update':
      case 'updated':
        return Edit
      case 'delete':
      case 'deleted':
        return Trash2
      case 'complete':
      case 'completed':
        return CheckCircle
      default:
        return Clock
    }
  }

  const formatActionDescription = (entry: TaskHistory) => {
    const action = entry.action.toLowerCase()

    if (action.includes('create')) {
      return 'Created this task'
    }

    if (action.includes('update')) {
      if (entry.previousValue && entry.newValue) {
        const changes: any = []
        if (typeof entry.newValue === 'object') {
          Object.keys(entry.newValue).forEach((key) => {
            if (entry.newValue[key] !== entry.previousValue[key]) {
              const prevVal = entry.previousValue[key] ?? 'None'
              const newVal = entry.newValue[key] ?? 'None'
              changes.push(`${key}: ${prevVal} → ${newVal}`)
            }
          })
        }
        return changes.length > 0
          ? `Updated: ${changes.join(', ')}`
          : 'Updated task details'
      }
      return 'Updated task details'
    }

    if (action.includes('delete')) {
      return 'Deleted this task'
    }

    if (action.includes('complete')) {
      return 'Marked task as complete'
    }

    return `${entry.action} this task`
  }

  const timelineItems = history.map((entry, index) => ({
    id: index + 1,
    date: new Date(entry.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    title: entry.action,
    description: formatActionDescription(entry),
    icon: getActionIcon(entry.action),
    userId: entry.userId,
    entry: entry,
  }))

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true)
        console.log('🔄 Fetching task history:', taskId)
        const historyData = await taskApi.getTaskHistory(taskId)
        setHistory(historyData)
        console.log('✅ Task history loaded:', historyData.length, 'entries')
      } catch (err) {
        console.error('❌ Failed to fetch task history:', err)
        setError('Failed to load task history')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [taskId])

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Task History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">
              Loading history...
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Task History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <p className="text-destructive mb-2">{error}</p>
            <p className="text-sm text-muted-foreground">
              Unable to load task activity
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // empty state
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Task History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground mb-1">No activity yet</p>
            <p className="text-sm text-muted-foreground">
              Task changes and updates will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Task History
          <Badge variant="secondary" className="h-5 px-2 text-xs">
            {history.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Timeline defaultValue={timelineItems.length}>
          {timelineItems.map((item) => (
            <TimelineItem
              key={item.id}
              step={item.id}
              className="group-data-[orientation=vertical]/timeline:ms-10"
            >
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                <div className="flex flex-col gap-1">
                  <TimelineTitle className="mt-0.5">{item.title}</TimelineTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{item.userId}</span>
                  </div>
                </div>
                <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                  <item.icon size={14} />
                </TimelineIndicator>
              </TimelineHeader>
              <TimelineContent>
                <p className="mb-2">{item.description}</p>

                {/* Show detailed changes for updates */}
                {item.entry.action.toLowerCase().includes('update') &&
                  item.entry.previousValue &&
                  item.entry.newValue && (
                    <div className="text-xs bg-muted/50 dark:bg-muted/20 rounded p-2 border border-border/50 mb-3">
                      <div className="font-medium text-foreground mb-1">
                        Changes:
                      </div>
                      <div className="space-y-1">
                        <div>
                          <span className="text-destructive">- </span>
                          <span className="text-muted-foreground">
                            {JSON.stringify(item.entry.previousValue)}
                          </span>
                        </div>
                        <div>
                          <span className="text-green-600 dark:text-green-400">
                            +{' '}
                          </span>
                          <span className="text-foreground">
                            {JSON.stringify(item.entry.newValue)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                <TimelineDate className="mt-2 mb-0">{item.date}</TimelineDate>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  )
}
