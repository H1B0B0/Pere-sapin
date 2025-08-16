import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Chalet {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  address?: string;
  capacity?: number;
  rooms?: string;
  bedrooms?: string;
  bathrooms?: string;
  pricePerNight?: number;
  prices?: {
    weekend?: string;
    week?: string;
    holidays?: string;
    cleaning?: string;
  };
  amenities?: string[];
  features?: string[];
  highlights?: string[];
  images?: string[];
  mainImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  pages: Page[];
  isActive: boolean;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  _id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  chalet: Chalet | string;
  chaletId: string;
  qrCodeUrl?: string;
  isActive: boolean;
  views: number;
  viewHistory: ViewHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface ViewHistory {
  ip: string;
  timestamp: Date;
  userAgent: string;
}

export interface PageStats {
  views: number;
  uniqueViews: number;
  dailyViews: { date: string; count: number }[];
  topUserAgents: { userAgent: string; count: number }[];
}

export interface CreateChaletDto {
  name: string;
  description?: string;
  location?: string;
  address?: string;
  capacity?: number;
  rooms?: string;
  bedrooms?: string;
  bathrooms?: string;
  pricePerNight?: number;
  prices?: {
    weekend?: string;
    week?: string;
    holidays?: string;
    cleaning?: string;
  };
  amenities?: string[];
  features?: string[];
  highlights?: string[];
  images?: string[];
  mainImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive?: boolean;
  color?: string;
  icon?: string;
}

export interface CreatePageDto {
  title: string;
  content: string;
  slug: string;
  tags?: string[];
  chalet: string;
}

export interface UpdatePageDto {
  title?: string;
  content?: string;
  slug?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface UpdateChaletDto {
  name?: string;
  description?: string;
  location?: string;
  address?: string;
  capacity?: number;
  rooms?: string;
  bedrooms?: string;
  bathrooms?: string;
  pricePerNight?: number;
  prices?: {
    weekend?: string;
    week?: string;
    holidays?: string;
    cleaning?: string;
  };
  amenities?: string[];
  features?: string[];
  highlights?: string[];
  images?: string[];
  mainImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive?: boolean;
  color?: string;
  icon?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export enum AvailabilityStatus {
  AVAILABLE = "available",
  BOOKED = "booked",
  BLOCKED = "blocked",
  MAINTENANCE = "maintenance",
}

export interface Availability {
  _id: string;
  chalet: Chalet | string;
  startDate: string;
  endDate: string;
  status: AvailabilityStatus;
  pricePerNight?: number;
  notes?: string;
  bookedBy?: string;
  bookingReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilityDto {
  chalet: string;
  startDate: string;
  endDate: string;
  status?: AvailabilityStatus;
  pricePerNight?: number;
  notes?: string;
  bookedBy?: string;
  bookingReference?: string;
}

export interface UpdateAvailabilityDto {
  startDate?: string;
  endDate?: string;
  status?: AvailabilityStatus;
  pricePerNight?: number;
  notes?: string;
  bookedBy?: string;
  bookingReference?: string;
}
