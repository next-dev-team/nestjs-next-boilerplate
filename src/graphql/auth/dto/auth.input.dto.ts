import { Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { BaseFilter } from '@common';

@InputType()
class SubAuthInput {
  @Field()
  @IsNotEmpty()
  fullName!: string;
}
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

  @Field(() => SubAuthInput)
  @ValidateNested()
  @Type(() => SubAuthInput)
  profile!: SubAuthInput;
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
