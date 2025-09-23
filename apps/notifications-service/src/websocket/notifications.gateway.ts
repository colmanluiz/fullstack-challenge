import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    // Listen for user authentication
    client.on("authenticate", (data) => {
      const { userId } = data;
      if (userId) {
        client.join(`user_${userId}`);
        console.log(`User ${userId} joined their notification room`);
        client.emit("authenticated", { success: true });
      }
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // sendNotificationToUser(userId: string, notification: any)
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user_${userId}`).emit("notification", notification);
  }
}
