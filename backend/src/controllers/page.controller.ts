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
} from '@nestjs/common';
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
    return this.pageService.findByChaletId(chaletId);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    const page = await this.pageService.findBySlug(slug);
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    return page;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pageService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePageDto: UpdatePageDto) {
    return this.pageService.update(id, updatePageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.pageService.remove(id);
  }

  @Post(':id/regenerate-qr')
  @UseGuards(JwtAuthGuard)
  regenerateQRCode(@Param('id') id: string) {
    return this.pageService.regenerateQRCode(id);
  }
}
