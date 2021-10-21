import { Resolver, Mutation } from '@nestjs/graphql';

import { i18next, I18NextTranslate } from '@lib/i18next';
import { I18NextGraph } from '@lib/i18next/i18next-graph.decorator';

import { I18nNextType } from './dto/i18n-next.model.dto';

// @AuthenticateAuthorize()
@Resolver(() => I18nNextType)
export class I18nNextResolver {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  @Mutation(() => I18nNextType)
  async translate(@I18NextGraph() i18n: i18next): Promise<any> {
    return { message: i18n.t<string, I18NextTranslate>('Hello') } as I18nNextType;
  }
}
