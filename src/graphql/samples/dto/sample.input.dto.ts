import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

import { BaseFilter, T } from '@common';
/**
 * NameType ...
 */
@InputType()
class NameType {
  @Field()
  firstName!: string;
  @Field()
  lastName!: string;
}
/**
 * sampleInput
 */
@InputType()
export class SampleInput {
  @Field()
  otherId!: string;

  @Field()
  @IsNotEmpty()
  readonly name!: string;

  @Field({ nullable: true })
  readonly startedTime?: string;

  @Field()
  @IsNotEmpty()
  readonly endedTime!: string;
  @Field()
  @IsNotEmpty()
  readonly releasedTime!: string;
  @Field(() => T.StatusEnum, {
    nullable: true,
    defaultValue: T.StatusEnum.ACTIVE
  })
  @IsNotEmpty()
  readonly status!: T.StatusEnum;

  @Field()
  nameType!: NameType;

  @Field(() => [NameType])
  nameTypes!: Array<NameType>;
}

/**
 * timeUpdate
 */
@InputType()
export class SampleUpdate {
  @Field(() => ID)
  @IsNotEmpty()
  readonly id?: string;
  @Field({ nullable: true })
  readonly name?: string;
  @Field({ nullable: true })
  readonly startedTime?: string;
  @Field({ nullable: true })
  readonly endedTime?: string;
  @Field({ nullable: true })
  readonly releasedTime?: string;
  @Field(() => T.StatusEnum, {
    nullable: true,
    defaultValue: T.StatusEnum.ACTIVE
  })
  readonly status!: T.StatusEnum;
}
/**
 * sampleFilter
 */
@InputType()
export class SampleFilter extends BaseFilter {
  @Field(() => ID, { nullable: true })
  readonly id?: string;
  @Field({ nullable: true })
  readonly name?: string;
}
