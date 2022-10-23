import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import * as Amqp from 'amqplib';
import * as admin from 'firebase-admin';
import { UserGateway } from 'src/socket-provider/user/user.gateway';

import { GetUser } from '@common';
import { RabbitMQService } from '@lib/rabbitmq';

import { TodoFilter, TodoInput, TodoUpdate } from './dto/todo.input.dto';
import { PaginatedTodoType, TodoType } from './dto/todo.model.dto';
import { TodoService } from './todo.service';

// @AuthenticateAuthorize()
@Resolver(() => TodoType)
export class TodoResolver {
  constructor(
    private readonly service: TodoService,
    private socketGateway: UserGateway,
    private rabbitMqService: RabbitMQService
  ) {
    this.consumeMsg();
  }

  @Mutation(() => Boolean)
  async pushNotificationToUser(@Args('userId') userId: string): Promise<boolean> {
    this.socketGateway.emit('welcome', { message: 'hello world' });
    return true;
  }
  @Mutation(() => Boolean)
  async sendMessage(@Args('msg') msg: string): Promise<boolean> {
    await this.rabbitMqService.sendToQueue('message', msg);
    return true;
  }

  @Mutation(() => TodoType)
  async createTodo(@Args('input') input: TodoInput): Promise<any> {
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
    const doc = await this.service.hardDelete(id);
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
    const records = await this.service.getPaginatedList(filter);
    return records;
  }

  @Query(() => [TodoType])
  async getActiveTodoList(@Args('filter') filter: TodoFilter): Promise<any[]> {
    return await this.service.findActive(filter);
  }

  @Mutation(() => Boolean)
  async pushNotification(): Promise<any> {
    admin.messaging().send({
      notification: { title: 'hello', body: 'hello body' },
      token:
        'cWuWotuBE9JNv4mA1zPyTK:APA91bE-opAxeekIH1CzkcATMIKq787bkjTwicYwDryTmrrzaqwmww6p9dFBWZ8c7dCEqFBXrfxF22LyMFQINJxRhJx_1LZeECxQd0aguZwyQFvx_g26NfeqaKQ7lf7o-XrkfsSBu6NC'
    });
    return true;
  }

  private async consumeMsg() {
    const consumeKey = 'message';
    this.rabbitMqService.getChannel().then(channel => {
      channel.assertQueue(consumeKey, {
        durable: true
      });
      channel.prefetch(1);
      channel.consume(
        consumeKey,
        async msg => {
          channel.ack(msg as Amqp.ConsumeMessage);
          if (msg) {
            const message = msg.content.toString();
            console.log('message', message);
          }
        },
        { noAck: false }
      );
    });
  }

  //!=========== Test firebase =========
  // @ResolveField(() => TodoType)
  // async id(@Parent() record: any) {
  //   const { _id, id } = record;
  //   return id || _id;
  // }
}
