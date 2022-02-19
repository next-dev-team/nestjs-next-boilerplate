import { Module } from '@nestjs/common';

import { I18nNextResolver } from './i18n-next/i18n-next.resolver';
import { TodoResolver } from './todo/todo.resolver';
import { TodoService } from './todo/todo.service';
import { UserResolver } from './user/user.resolver';
import { UserService } from './user/user.service';

@Module({
  imports: [],
  providers: [
    //--,
    I18nNextResolver,
    UserResolver,
    UserService,
    TodoResolver,
    TodoService
    // UsersLoaders
  ]
})
export class GraphQLModules {}
