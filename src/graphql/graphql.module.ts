import { Module } from '@nestjs/common';

import { I18nNextResolver } from './i18n-next/i18n-next.resolver';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    // --
    TodoModule
  ],
  providers: [
    //--,
    I18nNextResolver
  ]
})
export class GraphQLModules {}
