import { Document } from 'mongoose';
import { Sample } from 'src/schema.ts';
export type SampleDocument = Sample & Document;
