import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { NotificationsController } from "./notifications.controller";
import { NotificationsService } from "./notifications.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "NOTIFICATIONS_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATIONS_SERVICE_HOST || "localhost",
          port: parseInt(process.env.NOTIFICATIONS_SERVICE_TCP_PORT as string) || 3006,
        },
      },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}