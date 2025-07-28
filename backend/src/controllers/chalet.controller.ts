import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ChaletService } from '../services/chalet.service';
import { CreateChaletDto, UpdateChaletDto } from '../dto/chalet.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('chalets')
export class ChaletController {
  constructor(private readonly chaletService: ChaletService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createChaletDto: CreateChaletDto) {
    try {
      return await this.chaletService.create(createChaletDto);
    } catch (error: any) {
      if (error.code === 11000) {
        // MongoDB duplicate key error
        if (error.keyPattern?.name) {
          throw new ConflictException(`Un chalet avec le nom "${createChaletDto.name}" existe déjà`);
        }
        throw new ConflictException('Un chalet avec ces données existe déjà');
      }
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.chaletService.findAll();
  }

  @Get('check-name/:name')
  @UseGuards(JwtAuthGuard)
  async checkNameAvailability(@Param('name') name: string) {
    const existingChalet = await this.chaletService.findByName(name);
    return { 
      available: !existingChalet,
      message: existingChalet ? `Le nom "${name}" est déjà utilisé` : `Le nom "${name}" est disponible`
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid chalet ID format');
    }
    return this.chaletService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateChaletDto: UpdateChaletDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid chalet ID format');
    }
    try {
      return await this.chaletService.update(id, updateChaletDto);
    } catch (error: any) {
      if (error.code === 11000) {
        // MongoDB duplicate key error
        if (error.keyPattern?.name) {
          throw new ConflictException(`Un chalet avec le nom "${updateChaletDto.name}" existe déjà`);
        }
        throw new ConflictException('Un chalet avec ces données existe déjà');
      }
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid chalet ID format');
    }
    return this.chaletService.remove(id);
  }
}
