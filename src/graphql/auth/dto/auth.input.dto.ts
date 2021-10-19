import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

import { BaseFilter } from '@common';
/**
 * sampleInput
 */
@InputType()
export class AuthInput {
  @Field()
  @IsNotEmpty()
  username!: string;

  @Field()
  password!: string;
}

/**
 * timeUpdate
 */
@InputType()
export class AuthUpdate extends AuthInput {
  @Field(() => ID)
  @IsNotEmpty()
  readonly id?: string;
}
/**
 * sampleFilter
 */
@InputType()
export class AuthFilter extends BaseFilter {
  @Field(() => ID, { nullable: true })
  readonly id?: string;

  @Field({ nullable: true })
  readonly username?: string;
}
