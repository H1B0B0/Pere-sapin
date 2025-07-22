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
  create(@Body() createChaletDto: CreateChaletDto) {
    return this.chaletService.create(createChaletDto);
  }

  @Get()
  findAll() {
    return this.chaletService.findAll();
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
  update(@Param('id') id: string, @Body() updateChaletDto: UpdateChaletDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid chalet ID format');
    }
    return this.chaletService.update(id, updateChaletDto);
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
