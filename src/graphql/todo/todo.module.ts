import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoHelperService } from 'src/helpers/todo.helper.service';
import { Todo, TodoSchema } from 'src/todo.ts';

import { JwtsModule } from '@lib/jwts/jwts.module';
import { JwtsService } from '@lib/jwts/jwts.service';

import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]), JwtsModule],
  providers: [TodoResolver, TodoService, JwtsService, TodoHelperService],
  exports: [MongooseModule]
})
export class TodoModule {}
