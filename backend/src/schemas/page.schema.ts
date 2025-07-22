import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PageDocument = Page & Document;

@Schema({ timestamps: true })
export class Page {

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string; // Markdown content

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'Chalet', required: true })
  chalet: Types.ObjectId;

  @Prop()
  qrCodeUrl?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  views: number;

  @Prop({
    type: [{ ip: String, timestamp: Date, userAgent: String }],
    default: [],
  })
  viewHistory: { ip: string; timestamp: Date; userAgent: string }[];
}

export const PageSchema = SchemaFactory.createForClass(Page);
