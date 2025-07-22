import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  BadRequestException,
  Req,
  Ip,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { PageService } from '../services/page.service';
import { CreatePageDto, UpdatePageDto } from '../dto/page.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('pages')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPageDto: CreatePageDto) {
    return this.pageService.create(createPageDto);
  }

  @Get()
  findAll() {
    return this.pageService.findAll();
  }

  @Get('chalet/:chaletId')
  findByChaletId(@Param('chaletId') chaletId: string) {
    if (!Types.ObjectId.isValid(chaletId)) {
      throw new BadRequestException('Invalid chalet ID format');
    }
    return this.pageService.findByChaletId(chaletId);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string, @Ip() ip: string, @Req() req: any) {
    const page = await this.pageService.findBySlugAndIncrementView(slug, {
      ip,
      userAgent: req.headers['user-agent'] || 'Unknown',
    });
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    return page;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid page ID format');
    }
    return this.pageService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid page ID format');
    }
    return this.pageService.update(id, updatePageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid page ID format');
    }
    return this.pageService.remove(id);
  }

  @Post(':id/regenerate-qr')
  @UseGuards(JwtAuthGuard)
  regenerateQRCode(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid page ID format');
    }
    return this.pageService.regenerateQRCode(id);
  }

  @Post(':id/view')
  incrementView(@Param('id') id: string, @Ip() ip: string, @Req() req: any) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid page ID format');
    }
    return this.pageService.incrementView(id, {
      ip,
      userAgent: req.headers['user-agent'] || 'Unknown',
    });
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  getPageStats(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid page ID format');
    }
    return this.pageService.getPageStats(id);
  }
}
