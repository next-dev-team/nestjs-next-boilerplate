import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class BaseCreation {
  createdAt?: Date;

  updatedAt?: Date;

  @Prop()
  createdBy?: Types.ObjectId;

  @Prop()
  updatedBy?: Types.ObjectId;
}
