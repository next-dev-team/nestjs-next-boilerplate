import { Module } from '@nestjs/common';

import { AuthResolver } from './auth/auth.resolver';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    // --
    TodoModule,
    UserModule
  ],
  providers: [
    //--,
    AuthResolver
  ]
})
export class GraphQLModules {}
