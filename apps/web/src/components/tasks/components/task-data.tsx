import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  AlertTriangle,
  CheckCircle,
  Circle,
  Timer,
  Eye,
} from 'lucide-react'

import { TaskStatus, TaskPriority } from '@/types/task'

export const taskStatuses = [
  {
    value: TaskStatus.TODO,
    label: 'To Do',
    icon: Circle,
  },
  {
    value: TaskStatus.IN_PROGRESS,
    label: 'In Progress',
    icon: Timer,
  },
  {
    value: TaskStatus.IN_REVIEW,
    label: 'In Review',
    icon: Eye,
  },
  {
    value: TaskStatus.DONE,
    label: 'Done',
    icon: CheckCircle,
  },
]

export const taskPriorities = [
  {
    value: TaskPriority.LOW,
    label: 'Low',
    icon: ArrowDown,
  },
  {
    value: TaskPriority.MEDIUM,
    label: 'Medium',
    icon: ArrowRight,
  },
  {
    value: TaskPriority.HIGH,
    label: 'High',
    icon: ArrowUp,
  },
  {
    value: TaskPriority.URGENT,
    label: 'Urgent',
    icon: AlertTriangle,
  },
]