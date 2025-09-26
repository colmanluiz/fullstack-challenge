import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern("get_users")
  async getAllUsers(@Payload() data: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = data;

    return await this.usersService.getUsers(page, limit);
  }

  @MessagePattern("get_user_by_id")
  async getUserById(@Payload() data: { userId: string }) {
    return await this.usersService.getUserById(data.userId);
  }
}
