import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page, PageDocument } from '../schemas/page.schema';
import { CreatePageDto, UpdatePageDto } from '../dto/page.dto';
import * as QRCode from 'qrcode';
import { ChaletService } from './chalet.service';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(Page.name) private pageModel: Model<PageDocument>,
    private chaletService: ChaletService,
  ) {}

  async create(createPageDto: CreatePageDto): Promise<Page> {
    // Generate QR code URL
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const pageUrl = `${baseUrl}/page/${createPageDto.slug}`;
    const qrCodeUrl = await QRCode.toDataURL(pageUrl);

    const pageData = {
      ...createPageDto,
      qrCodeUrl,
    };

    const createdPage = new this.pageModel(pageData);
    const savedPage = await createdPage.save();

    // Add page to chalet
    await this.chaletService.addPage(
      createPageDto.chalet,
      (savedPage._id as string).toString(),
    );

    return savedPage;
  }

  async findAll(): Promise<Page[]> {
    return this.pageModel.find().populate('chalet').exec();
  }

  async findOne(id: string): Promise<Page | null> {
    return this.pageModel.findById(id).populate('chalet').exec();
  }

  async findBySlug(slug: string): Promise<Page | null> {
    return this.pageModel
      .findOne({ slug, isActive: true })
      .populate('chalet')
      .exec();
  }

  async findByChaletId(chaletId: string): Promise<Page[]> {
    return this.pageModel.find({ chalet: chaletId }).exec();
  }

  async update(id: string, updatePageDto: UpdatePageDto): Promise<Page | null> {
    const updateData = { ...updatePageDto };

    // If slug is updated, regenerate QR code
    if (updatePageDto.slug) {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const pageUrl = `${baseUrl}/page/${updatePageDto.slug}`;
      updateData['qrCodeUrl'] = await QRCode.toDataURL(pageUrl);
    }

    return this.pageModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Page | null> {
    const page = await this.pageModel.findById(id);
    if (page) {
      await this.chaletService.removePage(page.chalet.toString(), id);
    }
    return this.pageModel.findByIdAndDelete(id).exec();
  }

  async regenerateQRCode(id: string): Promise<Page | null> {
    const page = await this.findOne(id);
    if (!page) return null;

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const pageUrl = `${baseUrl}/page/${page.slug}`;
    const qrCodeUrl = await QRCode.toDataURL(pageUrl);

    return this.pageModel
      .findByIdAndUpdate(id, { qrCodeUrl }, { new: true })
      .exec();
  }
}
