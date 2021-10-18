import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from '@schema';
import { TodoHelperService } from 'src/helpers/todo.helper.service';

import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }])],
  providers: [TodoResolver, TodoService, TodoHelperService],
  exports: [MongooseModule]
})
export class TodoModule {}
