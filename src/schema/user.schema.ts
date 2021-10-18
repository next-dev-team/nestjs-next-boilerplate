import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { T } from '@common';
@Schema()
export class User {
  @Prop()
  username!: string;

  @Prop()
  password?: string;

  @Prop({ enum: Object.values(T.StatusEnum), createdIndex: true })
  status!: string;

  @Prop({ type: Types.ObjectId })
  createdBy!: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;

  @Prop({ type: Types.ObjectId })
  updatedBy?: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  updatedAt!: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
