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
  UploadedFile,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Types } from 'mongoose';
import { PageService } from '../services/page.service';
import { CreatePageDto, UpdatePageDto } from '../dto/page.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Multer } from 'multer';

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
  async findBySlug(
    @Param('slug') slug: string,
    @Ip() ip: string,
    @Req() req: any,
  ) {
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

  @Post(':id/upload-image')
  @UseGuards(JwtAuthGuard)
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Multer.File,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid page ID format');
    }

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File size must be less than 10MB');
    }

    return this.pageService.addImage(id, {
      filename: `${Date.now()}-${file.originalname}`,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: file.buffer.toString('base64'),
    });
  }

  @Get(':id/images/:filename')
  async getImage(
    @Param('id') id: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid page ID format');
    }

    const image = await this.pageService.getImage(id, filename);
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const buffer = Buffer.from(image.data, 'base64');
    res.set({
      'Content-Type': image.mimetype,
      'Content-Length': buffer.length.toString(),
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
    });

    return res.send(buffer);
  }
}
