import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true })
  currency!: string;

  @Prop({ required: true })
  payer!: string;

  @Prop()
  payerReference?: string; // e.g., *208

  @Prop({ required: true })
  paymentDate!: Date;

  @Prop()
  paymentMethod?: string; // e.g., ABA PAY

  @Prop()
  merchant?: string; // e.g., Cambodiamark

  @Prop()
  cashier?: string; // e.g., L.RIM

  @Prop()
  transactionId?: string;

  @Prop()
  approvalCode?: string; // APV

  @Prop({ required: true })
  rawMessage!: string;

  @Prop({ type: Object })
  chatHistory?: {
    messageId: number;
    from: {
      id: number;
      firstName?: string;
      lastName?: string;
      username?: string;
      isBot?: boolean;
    };
    chat: {
      id: number;
      type: string;
      title?: string;
    };
    date: number;
    text: string;
  };

  @Prop()
  telegramMessageId?: number;

  @Prop()
  telegramChatId?: string;

  @Prop()
  telegramUserId?: number;

  @Prop()
  telegramUsername?: string;

  @Prop({ default: false })
  isProcessed!: boolean;

  @Prop()
  notes?: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

// Add indexes for better query performance
InvoiceSchema.index({ paymentDate: -1 });
InvoiceSchema.index({ payer: 1 });
InvoiceSchema.index({ telegramChatId: 1 });
// Compound unique index: same transaction ID can exist in different groups
InvoiceSchema.index({ transactionId: 1, telegramChatId: 1 }, { unique: true, sparse: true });
