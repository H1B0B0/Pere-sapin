import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AvailabilityDocument = Availability & Document;

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  BLOCKED = 'blocked',
  MAINTENANCE = 'maintenance',
}

@Schema({ timestamps: true })
export class Availability {
  @Prop({ type: Types.ObjectId, ref: 'Chalet', required: true })
  chalet: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ 
    type: String, 
    enum: Object.values(AvailabilityStatus),
    default: AvailabilityStatus.AVAILABLE 
  })
  status: AvailabilityStatus;

  @Prop()
  pricePerNight?: number;

  @Prop()
  notes?: string;

  @Prop()
  bookedBy?: string;

  @Prop()
  bookingReference?: string;
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);