import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from '@schemas';

import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }])],
  providers: [TodoResolver, TodoService],
  exports: [MongooseModule]
})
export class TodoModule {}
