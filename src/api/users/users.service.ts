import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@schema/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateData: Partial<User>) {
    const user = await this.findOne(id);
    Object.assign(user, updateData);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.userRepository.softRemove(user);
  }
}
