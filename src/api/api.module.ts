import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

// Controllers
import { UsersController } from './users/users.controller';
import { HealthController } from './health/health.controller';

// Services
import { UsersService } from './users/users.service';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [UsersController, HealthController],
  providers: [UsersService],
  exports: [UsersService]
})
export class ApiModule {}
