import { IsNotEmpty, IsEnum, IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';
import { AvailabilityStatus } from '../schemas/availability.schema';

export class CreateAvailabilityDto {
  @IsNotEmpty()
  @IsString()
  chalet: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(AvailabilityStatus)
  status?: AvailabilityStatus;

  @IsOptional()
  @IsNumber()
  pricePerNight?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  bookedBy?: string;

  @IsOptional()
  @IsString()
  bookingReference?: string;
}

export class UpdateAvailabilityDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(AvailabilityStatus)
  status?: AvailabilityStatus;

  @IsOptional()
  @IsNumber()
  pricePerNight?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  bookedBy?: string;

  @IsOptional()
  @IsString()
  bookingReference?: string;
}

export class CreateChaletDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsNumber()
  pricePerNight?: number;

  @IsOptional()
  amenities?: string[];

  @IsOptional()
  images?: string[];

  @IsOptional()
  @IsString()
  mainImage?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}