import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreatePageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsMongoId()
  @IsNotEmpty()
  chalet: string;
}

export class UpdatePageDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
