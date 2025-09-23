import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "TASKS_SERVICE",
        transport: Transport.TCP,
        options: {
          host: process.env.TASKS_SERVICE_HOST || "localhost",
          port: parseInt(process.env.TASKS_SERVICE_PORT as string) || 3003,
        },
      },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
