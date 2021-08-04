import { Field, InputType, Int } from '@nestjs/graphql';

import { VARIABLE } from '../constants';
import { StatusEnum } from '../types';
@InputType()
export class BaseFilter {
  @Field(() => [StatusEnum], {
    nullable: true,
    defaultValue: [StatusEnum.ACTIVE, StatusEnum.INACTIVE]
  })
  readonly status!: Array<StatusEnum>;
  @Field(() => Int, { defaultValue: VARIABLE.defaultLimit, nullable: true })
  readonly limit!: number;
  @Field(() => Int, { defaultValue: VARIABLE.defaultPageNum, nullable: true })
  readonly page!: number;
}
