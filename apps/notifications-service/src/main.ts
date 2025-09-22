import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common/services/logger.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // cors configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  // rabbitmq microservice configuration
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || "amqp://localhost:5672"],
      queue: process.env.TASKS_SERVICE_QUEUE || "tasks_queue",
      queueOptions: {
        durable: false,
      },
    },
  });

  // start both http and rabbitmq microservice
  await app.startAllMicroservices();

  const port = process.env.NOTIFICATIONS_SERVICE_PORT || 3005;
  await app.listen(port);

  Logger.log(`Notifications service is running on: ${port}`);
  Logger.log(
    `Connected to RabbitMQ at: ${process.env.RABBITMQ_URL || "amqp://localhost:5672"}`
  );
  Logger.log(`WebSocket Gateway available for real-time notifications`);
}

bootstrap();
