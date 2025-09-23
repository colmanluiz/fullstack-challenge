import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { Task } from "../entities/task.entity";
import { ValidationService } from "./services/validation.service";
import { EventsService } from "./services/events.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ClientsModule.register([
      {
        name: "AUTH_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || "localhost",
          port: parseInt(process.env.AUTH_SERVICE_PORT as string) || 3002,
        },
      },
      {
        name: "EVENTS_SERVICE",
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || "amqp://admin:admin@localhost:5672",
          ],
          queue: "task_events",
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [ValidationService, EventsService],
  exports: [ValidationService, EventsService],
})
export class SharedModule {}
