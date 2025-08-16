import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateChaletDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  rooms?: string;

  @IsString()
  @IsOptional()
  bedrooms?: string;

  @IsString()
  @IsOptional()
  bathrooms?: string;

  @IsNumber()
  @IsOptional()
  pricePerNight?: number;

  @IsOptional()
  prices?: {
    weekend?: string;
    week?: string;
    holidays?: string;
    cleaning?: string;
  };

  @IsArray()
  @IsOptional()
  amenities?: string[];

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsArray()
  @IsOptional()
  highlights?: string[];

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  mainImage?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}

export class UpdateChaletDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  rooms?: string;

  @IsString()
  @IsOptional()
  bedrooms?: string;

  @IsString()
  @IsOptional()
  bathrooms?: string;

  @IsNumber()
  @IsOptional()
  pricePerNight?: number;

  @IsOptional()
  prices?: {
    weekend?: string;
    week?: string;
    holidays?: string;
    cleaning?: string;
  };

  @IsArray()
  @IsOptional()
  amenities?: string[];

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsArray()
  @IsOptional()
  highlights?: string[];

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  mainImage?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  icon?: string;
}
