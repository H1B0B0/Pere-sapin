import { Injectable, NotFoundException } from '@nestjs/common';
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
    const baseUrl = process.env.FRONTEND_URL || 'http://frontend:3000';
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
      const baseUrl = process.env.FRONTEND_URL || 'http://frontend:3000';
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

    const baseUrl = process.env.FRONTEND_URL || 'http://frontend:3000';
    const pageUrl = `${baseUrl}/page/${page.slug}`;
    const qrCodeUrl = await QRCode.toDataURL(pageUrl);

    return this.pageModel
      .findByIdAndUpdate(id, { qrCodeUrl }, { new: true })
      .exec();
  }

  async findBySlugAndIncrementView(
    slug: string,
    viewData: { ip: string; userAgent: string },
  ): Promise<Page | null> {
    const page = (await this.pageModel
      .findOne({ slug, isActive: true })
      .populate('chalet')
      .exec()) as Page & { _id: any };

    if (page) {
      await this.incrementView(page._id.toString(), viewData);
    }

    return page;
  }

  async incrementView(
    id: string,
    viewData: { ip: string; userAgent: string },
  ): Promise<Page | null> {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Check if this IP already viewed this page in the last 24 hours
    const existingView = await this.pageModel.findOne({
      _id: id,
      'viewHistory.ip': viewData.ip,
      'viewHistory.timestamp': { $gt: twentyFourHoursAgo },
    });

    if (!existingView) {
      // Add new view only if IP hasn't viewed in last 24 hours
      return this.pageModel
        .findByIdAndUpdate(
          id,
          {
            $inc: { views: 1 },
            $push: {
              viewHistory: {
                ip: viewData.ip,
                timestamp: now,
                userAgent: viewData.userAgent,
              },
            },
          },
          { new: true },
        )
        .populate('chalet')
        .exec();
    }

    // Return the page without incrementing view count
    return this.pageModel.findById(id).populate('chalet').exec();
  }

  async getPageStats(id: string): Promise<{
    views: number;
    uniqueViews: number;
    dailyViews: { date: string; count: number }[];
    topUserAgents: { userAgent: string; count: number }[];
  } | null> {
    const page = await this.pageModel.findById(id);
    if (!page) return null;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get recent views for analytics
    const recentViews = page.viewHistory.filter(
      (view) => view.timestamp >= thirtyDaysAgo,
    );

    // Calculate daily views for the last 30 days
    const dailyViewsMap = new Map<string, number>();
    recentViews.forEach((view) => {
      const dateKey = view.timestamp.toISOString().split('T')[0];
      dailyViewsMap.set(dateKey, (dailyViewsMap.get(dateKey) || 0) + 1);
    });

    const dailyViews = Array.from(dailyViewsMap.entries()).map(
      ([date, count]) => ({ date, count }),
    );

    // Calculate top user agents
    const userAgentMap = new Map<string, number>();
    recentViews.forEach((view) => {
      const agent = view.userAgent || 'Unknown';
      userAgentMap.set(agent, (userAgentMap.get(agent) || 0) + 1);
    });

    const topUserAgents = Array.from(userAgentMap.entries())
      .map(([userAgent, count]) => ({ userAgent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      views: page.views,
      uniqueViews: new Set(page.viewHistory.map((v) => v.ip)).size,
      dailyViews,
      topUserAgents,
    };
  }

  async addImage(
    pageId: string,
    imageData: {
      filename: string;
      originalName: string;
      mimetype: string;
      size: number;
      data: string;
    },
  ): Promise<{ url: string; filename: string }> {
    const page = await this.pageModel.findById(pageId);
    if (!page) {
      throw new NotFoundException('Page not found');
    }

    // Add image to page
    const updatedPage = await this.pageModel.findByIdAndUpdate(
      pageId,
      {
        $push: {
          images: {
            ...imageData,
            uploadedAt: new Date(),
          },
        },
      },
      { new: true },
    );

    // Return URL to access the image
    const baseUrl = process.env.FRONTEND_URL || 'http://frontend:3000';
    return {
      url: `${baseUrl}/api/proxy/pages/${pageId}/images/${imageData.filename}`,
      filename: imageData.filename,
    };
  }

  async getImage(
    pageId: string,
    filename: string,
  ): Promise<{ data: string; mimetype: string } | null> {
    const page = await this.pageModel.findById(pageId);
    if (!page) {
      throw new NotFoundException('Page not found');
    }

    const image = page.images.find((img) => img.filename === filename);
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    return {
      data: image.data,
      mimetype: image.mimetype,
    };
  }
}
