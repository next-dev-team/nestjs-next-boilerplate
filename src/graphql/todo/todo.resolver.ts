import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { TodoHelperService } from 'src/helpers/todo.helper.service';

import { GetUser } from '@common';

import { TodoFilter, TodoInput, TodoUpdate } from './dto/todo.input.dto';
import { PaginatedTodoType, TodoType } from './dto/todo.model.dto';
import { TodoService } from './todo.service';

@Resolver(() => TodoType)
export class TodoResolver {
  constructor(private readonly service: TodoService, private todoHelperSvc: TodoHelperService) {}
  @Mutation(() => TodoType)
  async createTodo(@Args('input') input: TodoInput): Promise<any> {
    console.log(this.todoHelperSvc);
    const existingDoc = await this.service.findOne({ title: input.title });
    if (existingDoc) throw new BadRequestException('title already exist');
    return await this.service.create({ ...input });
  }

  @Mutation(() => TodoType)
  async updateTodo(@GetUser() { _id: userId }, @Args('input') input: TodoUpdate): Promise<any> {
    return this.service.update({ ...input, updatedBy: userId });
  }

  @Mutation(() => TodoType)
  async deleteTodo(@Args('id') id: string): Promise<any> {
    const doc = await this.service.delete(id);
    if (!doc) return new NotFoundException('Record not found');
    return doc;
  }

  @Query(() => TodoType)
  async getTodo(@Args('filter') filter: TodoFilter): Promise<any> {
    const doc = await this.service.findOne(filter);
    if (!doc) return new NotFoundException('Record not found');
    return doc;
  }

  @Query(() => PaginatedTodoType)
  async getTodoList(@Args('filter') filter: TodoFilter): Promise<PaginatedTodoType> {
    const records = await this.service.findAll(filter);
    const total = await this.service.count(filter);
    return {
      records,
      metadata: { limit: filter.limit, page: filter.page, total }
    };
  }

  @Query(() => [TodoType])
  async getActiveTodoList(@Args('filter') filter: TodoFilter): Promise<any[]> {
    return await this.service.findActive(filter);
  }

  @ResolveField(() => TodoType)
  async id(@Parent() record: any) {
    const { _id, id } = record;
    return id || _id;
  }
}
