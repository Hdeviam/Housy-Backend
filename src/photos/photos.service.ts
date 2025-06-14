import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from '../entities/photo.entity';
import { UploadPhotoDto } from '../dto/upload-photo.dto';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
  ) {}

  async uploadPhoto(propertyId: string, dto: UploadPhotoDto): Promise<Photo> {
    const photo = this.photoRepository.create({
      ...dto,
      propertyId,
    });
    return await this.photoRepository.save(photo);
  }

  async getPhotosByPropertyId(propertyId: string): Promise<Photo[]> {
    return this.photoRepository.find({ where: { propertyId } });
  }

  async updatePhoto(id: number, dto: UploadPhotoDto): Promise<Photo> {
    const photo = await this.photoRepository.findOneBy({ id });
    if (!photo) {
      throw new NotFoundException(`Foto con ID ${id} no encontrada`);
    }
    Object.assign(photo, dto);
    return await this.photoRepository.save(photo);
  }

  async deletePhoto(id: number): Promise<void> {
    const result = await this.photoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Foto con ID ${id} no encontrada`);
    }
  }
}
