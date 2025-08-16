import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Availability, AvailabilityDocument } from '../schemas/availability.schema';
import { CreateAvailabilityDto, UpdateAvailabilityDto } from '../dto/availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(Availability.name) private availabilityModel: Model<AvailabilityDocument>,
  ) {}

  async create(createAvailabilityDto: CreateAvailabilityDto): Promise<Availability> {
    const { startDate, endDate, chalet } = createAvailabilityDto;
    
    // Vérifier que la date de fin est après la date de début
    if (new Date(endDate) <= new Date(startDate)) {
      throw new BadRequestException('La date de fin doit être après la date de début');
    }

    // Vérifier qu'il n'y a pas de conflit avec d'autres disponibilités
    const conflictingAvailability = await this.availabilityModel.findOne({
      chalet,
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) }
        }
      ]
    });

    if (conflictingAvailability) {
      throw new BadRequestException('Cette période entre en conflit avec une disponibilité existante');
    }

    const createdAvailability = new this.availabilityModel({
      ...createAvailabilityDto,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return createdAvailability.save();
  }

  async findAll(): Promise<Availability[]> {
    return this.availabilityModel.find().populate('chalet').exec();
  }

  async findByChaletId(chaletId: string): Promise<Availability[]> {
    return this.availabilityModel.find({ chalet: chaletId }).populate('chalet').exec();
  }

  async findAvailablePeriods(chaletId: string, startDate?: string, endDate?: string): Promise<Availability[]> {
    const query: any = { 
      chalet: chaletId, 
      status: 'available' 
    };

    if (startDate || endDate) {
      query.$and = [];
      if (startDate) {
        query.$and.push({ endDate: { $gte: new Date(startDate) } });
      }
      if (endDate) {
        query.$and.push({ startDate: { $lte: new Date(endDate) } });
      }
    }

    return this.availabilityModel.find(query).populate('chalet').exec();
  }

  async findOne(id: string): Promise<Availability> {
    const availability = await this.availabilityModel.findById(id).populate('chalet').exec();
    if (!availability) {
      throw new NotFoundException(`Disponibilité avec l'ID ${id} non trouvée`);
    }
    return availability;
  }

  async update(id: string, updateAvailabilityDto: UpdateAvailabilityDto): Promise<Availability> {
    const updateData: any = { ...updateAvailabilityDto };
    
    if (updateAvailabilityDto.startDate) {
      updateData.startDate = new Date(updateAvailabilityDto.startDate);
    }
    if (updateAvailabilityDto.endDate) {
      updateData.endDate = new Date(updateAvailabilityDto.endDate);
    }

    const updatedAvailability = await this.availabilityModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('chalet')
      .exec();

    if (!updatedAvailability) {
      throw new NotFoundException(`Disponibilité avec l'ID ${id} non trouvée`);
    }

    return updatedAvailability;
  }

  async remove(id: string): Promise<void> {
    const result = await this.availabilityModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Disponibilité avec l'ID ${id} non trouvée`);
    }
  }
}