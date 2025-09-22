import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  // TODO: Add RabbitMQ event handlers
  // @EventPattern('task.created')
  // @EventPattern('task.updated')
  // @EventPattern('comment.created')
}