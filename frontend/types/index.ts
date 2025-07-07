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
  pages: Page[];
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateChaletDto {
  name: string;
  description?: string;
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
