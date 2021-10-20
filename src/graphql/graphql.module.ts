import { Module } from '@nestjs/common';

import { AuthResolver } from './auth/auth.resolver';
import { I18nNextResolver } from './i18n-next/i18n-next.resolver';
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
    AuthResolver,
    I18nNextResolver
  ]
})
export class GraphQLModules {}
