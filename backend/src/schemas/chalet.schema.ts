import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChaletDocument = Chalet & Document;

@Schema({ timestamps: true })
export class Chalet {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Page' }] })
  pages: Types.ObjectId[];
}

export const ChaletSchema = SchemaFactory.createForClass(Chalet);
