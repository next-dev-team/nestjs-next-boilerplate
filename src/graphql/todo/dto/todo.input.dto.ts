import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

import { BaseFilter, T } from '@common';
/**
 * sampleInput
 */
@InputType()
export class TodoInput {
  @Field()
  @IsNotEmpty()
  title!: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => T.StatusEnum, {
    nullable: true,
    defaultValue: T.StatusEnum.ACTIVE
  })
  @IsNotEmpty()
  readonly status!: T.StatusEnum;
}

/**
 * timeUpdate
 */
@InputType()
export class TodoUpdate extends TodoInput {
  @Field(() => ID)
  @IsNotEmpty()
  readonly id?: string;
}
/**
 * sampleFilter
 */
@InputType()
export class TodoFilter extends BaseFilter {
  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field({ nullable: true })
  readonly name?: string;
}
