import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/auth/jwt-auth.guard";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "Get all users with pagination" })
  @ApiResponse({ status: 200, description: "Users retrieved successfully" })
  async getUsers(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    return this.usersService.getUsers(page, limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User retrieved successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getUserById(@Param("id") userId: string) {
    return this.usersService.getUserById(userId);
  }
}
