import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@entities';

import { CreateAuthDto } from './dto/auth.model.dto';

@ApiTags('Example - I18Next')
@Controller('api/auth')
export class AuthController {
  constructor(@InjectRepository(UserEntity) private readonly user: Repository<UserEntity>) {}
  @Post()
  async createAuth(@Body() input: CreateAuthDto): Promise<any> {
    console.log('input:', input);
    const result = await this.user.save(input);
    console.log('result:', result);
    return result;
  }
}
