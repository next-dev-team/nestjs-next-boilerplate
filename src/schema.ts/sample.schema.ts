import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
// export const TimeSchema = new mongoose.Schema({
//   Type: String,
//   startedTime: String,
//   endedTime: String,
//   releasedTime: String,
//   status: { type: String, createdIndex: true },
//   createdBy: String,
//   createdAt: Date,
//   updatedBy: String,
//   updatedAt: {type:Date, default:Date.now},
// });
export class Name {
  @Prop({ type: Types.ObjectId, default: Types.ObjectId() })
  _id!: Types.ObjectId;

  @Prop()
  firstType!: string;

  @Prop()
  lastName!: string;
}
@Schema()
export class Sample {
  @Prop({ type: Types.ObjectId })
  otherId!: string;

  @Prop()
  name!: string;

  @Prop()
  startedTime?: string;

  @Prop()
  endedTime!: string;

  @Prop()
  releasedTime!: string;

  @Prop({ type: String, createdIndex: true })
  status!: string;

  @Prop({ type: Name })
  nameType?: Name;

  @Prop({ type: Name })
  nameTypes!: Name[];

  @Prop({ type: Types.ObjectId })
  createdBy?: Types.ObjectId;

  @Prop()
  createdAt!: Date;

  @Prop({ type: Types.ObjectId })
  updatedBy?: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  updatedAt!: Date;
}
export const SampleSchema = SchemaFactory.createForClass(Sample);
