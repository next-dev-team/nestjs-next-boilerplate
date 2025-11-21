import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { GetUser } from '@common/decorators/get-user.decorator';
import { UserRole } from '@schema/entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@GetUser('id') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@GetUser('id') userId: string, @Body() updateData: any) {
    return this.usersService.update(userId, updateData);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
