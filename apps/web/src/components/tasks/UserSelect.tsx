import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, X, Users } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { userApi } from '@/services/userApi'

import type { User } from '@/types/auth'

interface UserSelectProps {
  selectedUsers: Array<string>
  onSelectionChange: (userIds: Array<string>) => void
  placeholder?: string
  maxSelections?: number
  excludeUserIds?: Array<string> // Users to exclude from selection
}

export function UserSelect({
  selectedUsers,
  onSelectionChange,
  placeholder = "Select users...",
  maxSelections = 10,
  excludeUserIds = [],
}: UserSelectProps) {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<Array<User>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Get selected user objects
  const selectedUserObjects = users.filter(user => selectedUsers.includes(user.id))

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const usersData = await userApi.getUsers()
        setUsers(usersData)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    if (open && users.length === 0) {
      fetchUsers()
    }
  }, [open, users.length])

  const handleUserToggle = (userId: string) => {
    const isSelected = selectedUsers.includes(userId)

    if (isSelected) {
      // Remove user
      onSelectionChange(selectedUsers.filter(id => id !== userId))
    } else {
      // Add user (if not at max limit)
      if (selectedUsers.length < maxSelections) {
        onSelectionChange([...selectedUsers, userId])
      }
    }
  }

  const handleRemoveUser = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    onSelectionChange(selectedUsers.filter(id => id !== userId))
  }

  const filteredUsers = users.filter(user => {
    // Filter out excluded users (already assigned)
    if (excludeUserIds.includes(user.id)) {
      return false
    }

    // Apply search filter
    return user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user.email.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between min-h-10"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {selectedUsers.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <span className="text-sm">
                  {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                </span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search users..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isLoading ? (
                <CommandEmpty>Loading users...</CommandEmpty>
              ) : filteredUsers.length === 0 ? (
                <CommandEmpty>No users found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {filteredUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={`${user.username} ${user.email}`}
                      onSelect={() => handleUserToggle(user.id)}
                      className="flex items-center gap-2"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedUsers.includes(user.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium truncate">{user.username}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected users badges */}
      {selectedUserObjects.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedUserObjects.map((user) => (
            <Badge
              key={user.id}
              variant="secondary"
              className="gap-1 pr-1"
            >
              <span className="max-w-[120px] truncate">{user.username}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 hover:bg-destructive hover:text-destructive-foreground"
                onClick={(e) => handleRemoveUser(user.id, e)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {selectedUsers.length >= maxSelections && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxSelections} users can be selected.
        </p>
      )}
    </div>
  )
}