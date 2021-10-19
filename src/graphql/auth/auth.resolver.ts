import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@entities';

import { AuthInput } from './dto/auth.input.dto';
import { AuthType } from './dto/auth.model.dto';

// @AuthenticateAuthorize()
@Resolver(() => AuthType)
export class AuthResolver {
  constructor(@InjectRepository(UserEntity) private readonly user: Repository<UserEntity>) {}
  @Mutation(() => AuthType)
  async createAuth(@Args('input') input: AuthInput): Promise<any> {
    console.log('input:', input);
    const result = await this.user.save(input);
    console.log('result:', result);
    return result;
  }

  // @Mutation(() => UserType)
  // async login(@Args('token') token: string): Promise<any> {
  //   const decoded = await this.jtwService.verify(token, { secret: process.env.JWT_SECRET });
  //   console.log('decoded:', decoded);
  //   const { username, password } = decoded;
  //   const existingDoc = await this.service.findOne({ username });
  //   if (!existingDoc) throw new BadRequestException('invalid user');
  //   const vPass = await UTIL.verifyPassword(password, existingDoc.password);
  //   if (!vPass) throw new BadRequestException('invalid password');
  //   return existingDoc;
  // }

  // @Mutation(() => UserType)
  // async updateUser(@GetUser() { _id: userId }, @Args('input') input: UserUpdate): Promise<any> {
  //   return this.service.update({ ...input, updatedBy: userId });
  // }

  // @Mutation(() => UserType)
  // async deleteUser(@Args('id') id: string): Promise<any> {
  //   const doc = await this.service.delete(id);
  //   if (!doc) return new NotFoundException('Record not found');
  //   return doc;
  // }

  // @Query(() => UserType)
  // async getUser(@Args('filter') filter: UserFilter): Promise<any> {
  //   const doc = await this.service.findOne(filter);
  //   if (!doc) return new NotFoundException('Record not found');
  //   return doc;
  // }

  // @Query(() => PaginatedUserType)
  // async getUserList(@Args('filter') filter: UserFilter): Promise<PaginatedUserType> {
  //   const records = await this.service.findAll(filter);
  //   const total = await this.service.count(filter);
  //   return {
  //     records,
  //     metadata: { limit: filter.limit, page: filter.page, total }
  //   };
  // }

  // @Query(() => [UserType])
  // async getActiveUserList(@Args('filter') filter: UserFilter): Promise<any[]> {
  //   return await this.service.findActive(filter);
  // }

  // @ResolveField(() => UserType)
  // async id(@Parent() record: any) {
  //   const { _id, id } = record;
  //   return id || _id;
  // }
}
