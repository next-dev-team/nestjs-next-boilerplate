import { Resolver, Mutation } from '@nestjs/graphql';

import { I18Next, i18next, I18NextTranslate } from '@lib/i18next';

import { I18nNextType } from './dto/i18n-next.model.dto';

// @AuthenticateAuthorize()
@Resolver(() => I18nNextType)
export class I18nNextResolver {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  @Mutation(() => I18nNextType)
  async translate(@I18Next() i18n: i18next): Promise<any> {
    return { message: i18n.t<string, I18NextTranslate>('MyName') } as I18nNextType;
  }
}
