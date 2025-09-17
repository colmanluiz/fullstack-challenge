import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create HTTP application for REST endpoints
  const app = await NestFactory.create(AppModule);
  
  // Add validation pipe for DTOs
  app.useGlobalPipes(new ValidationPipe());
  
  // Connect TCP microservice for inter-service communication
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.HOST || '0.0.0.0',
      port: parseInt(process.env.MICROSERVICE_PORT as string, 10) || 3003,
    },
  });

  await app.startAllMicroservices();
  await app.listen(parseInt(process.env.PORT as string, 10) || 3002);
  
  Logger.log(`Auth service HTTP server running on port ${process.env.PORT || 3002}`);
  Logger.log(`Auth service microservice running on TCP port ${process.env.MICROSERVICE_PORT || 3003}`);
}
bootstrap();