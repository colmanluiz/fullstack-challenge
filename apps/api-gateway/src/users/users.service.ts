import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Injectable()
export class UsersService {
  constructor(
    @Inject("AUTH_SERVICE") private readonly usersClient: ClientProxy
  ) {}

  async getUsers(page: number = 1, limit: number = 10) {
    return firstValueFrom(this.usersClient.send("get_users", { page, limit }));
  }

  async getUserById(userId: string) {
    return firstValueFrom(this.usersClient.send("get_user_by_id", { userId }));
  }

  async getCurrentUser(userId: string) {
    return firstValueFrom(this.usersClient.send("get_current_user", { userId }));
  }
}
