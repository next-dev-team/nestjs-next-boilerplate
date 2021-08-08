import { Module } from '@nestjs/common';
import { TodoModule } from 'src/graphql/todo/todo.module';
import { TodoService } from 'src/graphql/todo/todo.service';

import { TodoHelperService } from './todo.helper.service';

@Module({
  imports: [TodoModule],
  providers: [TodoHelperService, TodoService],
  exports: [TodoHelperService]
})
export class HelpersModule {}
