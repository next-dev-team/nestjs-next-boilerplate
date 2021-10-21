import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { User } from '@schemas';

import { GetUser, UTIL } from '@common';

import { UserFilter, UserInput, UserUpdate } from './dto/user.input.dto';
import { PaginatedUserType, UserType } from './dto/user.model.dto';
import { UserService } from './user.service';

// @AuthenticateAuthorize()
@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly service: UserService, private jtwService: JwtService) {}
  @Mutation(() => UserType)
  async createUser(@Args('input') input: UserInput): Promise<any> {
    const existingDoc = await this.service.findOne({ username: input.username });
    if (existingDoc) throw new BadRequestException('username already exist');
    const newPass = await UTIL.createPassword(input.password);
    const doc = await this.service.create({ ...input, password: newPass });
    // const token = await this.jtwService.signAsync({ username: doc.username, password: input.password });
    return doc;
  }

  @Mutation(() => UserType)
  async login(@Args('token') token: string): Promise<any> {
    const decoded = await this.jtwService.verify(token, { secret: process.env.JWT_SECRET });
    console.log('decoded:', decoded);
    const { username, password } = decoded;
    const existingDoc = (await this.service.findOne({ username })) as User;
    if (!existingDoc) throw new BadRequestException('invalid user');
    const vPass = await UTIL.verifyPassword(password, existingDoc.password);
    if (!vPass) throw new BadRequestException('invalid password');
    return existingDoc;
  }

  @Mutation(() => UserType)
  async updateUser(@GetUser() { _id: userId }, @Args('input') input: UserUpdate): Promise<any> {
    return this.service.update({ ...input, updatedBy: userId });
  }

  @Mutation(() => UserType)
  async deleteUser(@Args('id') id: string): Promise<any> {
    const doc = await this.service.softDelete(id);
    if (!doc) return new NotFoundException('Record not found');
    return doc;
  }

  @Query(() => UserType)
  async getUser(@Args('filter') filter: UserFilter): Promise<any> {
    const doc = await this.service.findOne(filter);
    if (!doc) return new NotFoundException('Record not found');
    return doc;
  }

  @Query(() => PaginatedUserType)
  async getUserList(@Args('filter') filter: UserFilter): Promise<PaginatedUserType> {
    return await this.service.getPaginatedList(filter);
  }

  @Query(() => [UserType])
  async getActiveUserList(@Args('filter') filter: UserFilter): Promise<any[]> {
    return await this.service.findActive(filter);
  }

  @ResolveField(() => UserType)
  async id(@Parent() record: any) {
    const { _id, id } = record;
    return id || _id;
  }
}
