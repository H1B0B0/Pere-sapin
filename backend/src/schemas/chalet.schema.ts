import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChaletDocument = Chalet & Document;

@Schema({ timestamps: true })
export class Chalet {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  location?: string;

  @Prop()
  address?: string;

  @Prop()
  capacity?: number;

  // Nombre de pièces (affichage rapide)
  @Prop()
  rooms?: string;

  // Détails lits/chambres
  @Prop()
  bedrooms?: string;

  // Détails salles de bain / WC
  @Prop()
  bathrooms?: string;

  @Prop()
  pricePerNight?: number;

  // Structure de prix détaillée (week-end, semaine, vacances, ménage, etc.)
  @Prop({ type: Object })
  prices?: {
    weekend?: string;
    week?: string;
    holidays?: string;
    cleaning?: string;
  };

  @Prop({ type: [String] })
  amenities?: string[];

  // Caractéristiques (plus marketing / mise en avant)
  @Prop({ type: [String] })
  features?: string[];

  // Points forts / labels / distinctions
  @Prop({ type: [String] })
  highlights?: string[];

  @Prop({ type: [String] })
  images?: string[];

  @Prop()
  mainImage?: string;

  @Prop()
  contactEmail?: string;

  @Prop()
  contactPhone?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Page' }] })
  pages: Types.ObjectId[];

  // Couleur d'accent / icône (utilisation frontend)
  @Prop()
  color?: string;

  @Prop()
  icon?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ChaletSchema = SchemaFactory.createForClass(Chalet);
