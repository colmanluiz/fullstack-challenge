import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.TASKS_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.TASKS_SERVICE_PORT as string) || 3004,
      },
    },
  );

  await app.listen();
  console.log('Tasks Service is listening on TCP port 3004');
}

bootstrap();