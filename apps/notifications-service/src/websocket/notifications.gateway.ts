import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private connectedUsers = new Map<string, AuthenticatedSocket>();

  afterInit(server: Server) {
    this.logger.log("WebSocket Gateway initialized");
  }

  handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`Client connected: ${client.id}`);

    const authTimeout = setTimeout(() => {
      if (!client.userId) {
        this.logger.warn(
          `Client ${client.id} disconnected due to authentication timeout`
        );
        client.emit("error", { message: "Authentication timeout" });
        client.disconnect();
      }
    }, 30000); // 30 seconds to authenticate

    client.data = { authTimeout };
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.data?.authTimeout) {
      clearTimeout(client.data.authTimeout);
    }

    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(`User ${client.userId} disconnected (${client.id})`);
    } else {
      this.logger.log(`Anonymous client disconnected: ${client.id}`);
    }
  }

  @SubscribeMessage("authenticate")
  handleAuthentication(client: AuthenticatedSocket, data: { userId: string }) {
    try {
      const { userId } = data;

      // basic validation
      if (!userId || typeof userId !== "string") {
        client.emit("authentication_failed", {
          error: "Invalid userId provided",
        });
        return;
      }

      // TODO: add JWT token validation here

      client.userId = userId;
      this.connectedUsers.set(userId, client);

      // join user-specific room
      client.join(`user_${userId}`);

      this.logger.log(
        `User ${userId} authenticated and joined room (${client.id})`
      );

      client.emit("authenticated", {
        success: true,
        userId,
        message: "Successfully authenticated to notifications service",
      });
    } catch (error) {
      this.logger.error(
        `Authentication failed for client ${client.id}: ${error.message}`
      );
      client.emit("authentication_failed", {
        error: "Authentication failed",
      });
    }
  }

  @SubscribeMessage("ping")
  handlePing(client: AuthenticatedSocket) {
    client.emit("pong", { timestamp: new Date().toISOString() });
  }

  // Send notification to specific user
  sendNotificationToUser(userId: string, notification: any) {
    try {
      const userRoom = `user_${userId}`;
      const clientsInRoom = this.server.sockets.adapter.rooms.get(userRoom);

      if (clientsInRoom && clientsInRoom.size > 0) {
        this.server.to(userRoom).emit("notification", notification);
        this.logger.log(
          `Notification sent to user ${userId} (${clientsInRoom.size} clients)`
        );
      } else {
        this.logger.warn(`No active connections for user ${userId}`);
      }
    } catch (error) {
      this.logger.error(
        `Failed to send notification to user ${userId}: ${error.message}`
      );
    }
  }

  // broadcast to all connected users
  broadcastToAll(event: string, data: any) {
    try {
      this.server.emit(event, data);
      this.logger.log(`Broadcasted ${event} to all connected clients`);
    } catch (error) {
      this.logger.error(`Failed to broadcast ${event}: ${error.message}`);
    }
  }

  // ==== getters for monitoring =====
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
}
