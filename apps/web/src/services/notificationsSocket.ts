import { io, Socket } from 'socket.io-client'

export const notificationsSocket: Socket = io('http://localhost:3004', {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
}) // add env variable for URL

// Error logging only
notificationsSocket.on('error', (error) => {
  console.error('WebSocket error:', error)
})
