import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chalet, ChaletDocument } from '../schemas/chalet.schema';
import { CreateChaletDto, UpdateChaletDto } from '../dto/chalet.dto';

@Injectable()
export class ChaletService {
  constructor(
    @InjectModel(Chalet.name) private chaletModel: Model<ChaletDocument>,
  ) {}

  async create(createChaletDto: CreateChaletDto): Promise<Chalet> {
    const createdChalet = new this.chaletModel(createChaletDto);
    return createdChalet.save();
  }

  async findAll(): Promise<Chalet[]> {
    return this.chaletModel.find().populate('pages').exec();
  }

  async findOne(id: string): Promise<Chalet | null> {
    return this.chaletModel.findById(id).populate('pages').exec();
  }

  async findByName(name: string): Promise<Chalet | null> {
    return this.chaletModel.findOne({ name }).populate('pages').exec();
  }

  async update(
    id: string,
    updateChaletDto: UpdateChaletDto,
  ): Promise<Chalet | null> {
    return this.chaletModel
      .findByIdAndUpdate(id, updateChaletDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Chalet | null> {
    return this.chaletModel.findByIdAndDelete(id).exec();
  }

  async addPage(chaletId: string, pageId: string): Promise<Chalet | null> {
    return this.chaletModel
      .findByIdAndUpdate(chaletId, { $push: { pages: pageId } }, { new: true })
      .exec();
  }

  async removePage(chaletId: string, pageId: string): Promise<Chalet | null> {
    return this.chaletModel
      .findByIdAndUpdate(chaletId, { $pull: { pages: pageId } }, { new: true })
      .exec();
  }
}
