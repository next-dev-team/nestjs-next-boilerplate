import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class I18nNextType {
  @Field({ nullable: true })
  message!: string;
}
