import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AvailabilityService } from '../services/availability.service';
import {
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
} from '../dto/availability.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('availabilities')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAvailabilityDto: CreateAvailabilityDto) {
    return this.availabilityService.create(createAvailabilityDto);
  }

  @Get()
  findAll() {
    return this.availabilityService.findAll();
  }

  @Get('chalet/:chaletId')
  findByChaletId(@Param('chaletId') chaletId: string) {
    return this.availabilityService.findByChaletId(chaletId);
  }

  @Get('chalet/:chaletId/available')
  findAvailablePeriods(
    @Param('chaletId') chaletId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.availabilityService.findAvailablePeriods(
      chaletId,
      startDate,
      endDate,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.availabilityService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.update(id, updateAvailabilityDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.availabilityService.remove(id);
  }
}
