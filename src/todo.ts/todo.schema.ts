import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { T } from '@common';
@Schema()
export class Todo {
  @Prop()
  title!: string;

  @Prop()
  description?: string;

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
export const TodoSchema = SchemaFactory.createForClass(Todo);
