import { Injectable, NotFoundException, Inject, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entity/photo.entity';
import { UploadPhotoDto } from './dto/upload-photo.dto';
import { IStorageService, STORAGE_SERVICE } from '../core/storage/storage.interface'; // Ajustada la ruta

@Injectable()
export class PhotosService {
  private readonly logger = new Logger(PhotosService.name);

  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @Inject(STORAGE_SERVICE) private readonly storageService: IStorageService,
  ) {}

  async uploadPhoto(
    propertyId: string,
    dto: UploadPhotoDto,
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
  ): Promise<Photo> {
    let uploadResult;
    try {
      // Usar un nombre de archivo único o una estrategia para evitar colisiones si es necesario.
      // Por ejemplo, podrías prefijar con propertyId o un UUID.
      const fileName = `${propertyId}-${Date.now()}-${originalName}`;
      uploadResult = await this.storageService.uploadFile(fileBuffer, fileName, mimeType);
    } catch (error) {
      this.logger.error(`Error uploading to storage service: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to upload photo to storage provider.');
    }

    const photo = this.photoRepository.create({
      propertyId,
      section: dto.section,
      url: uploadResult.url,
      publicId: uploadResult.publicId, // Guardar el publicId
    });

    try {
      return await this.photoRepository.save(photo);
    } catch (dbError) {
      this.logger.error(`Database error after uploading photo: ${dbError.message}`, dbError.stack);
      // Si falla la base de datos, deberíamos intentar eliminar el archivo subido (rollback)
      if (uploadResult && uploadResult.publicId) {
        this.logger.warn(`Attempting to delete uploaded file ${uploadResult.publicId} due to DB error.`);
        await this.storageService.deleteFile(uploadResult.publicId).catch(deleteError => {
          this.logger.error(`Failed to delete uploaded file ${uploadResult.publicId} during rollback: ${deleteError.message}`, deleteError.stack);
        });
      }
      throw new InternalServerErrorException('Failed to save photo information to database.');
    }
  }

  async getPhotosByPropertyId(propertyId: string): Promise<Photo[]> {
    return this.photoRepository.find({ where: { propertyId } });
  }

  async updatePhoto(id: number, dto: UploadPhotoDto): Promise<Photo> {
    // Nota: Esta función actualmente solo actualiza la 'section'.
    // Si se quisiera reemplazar el archivo, se necesitaría una lógica similar a uploadPhoto y deletePhoto.
    const photo = await this.photoRepository.findOneBy({ id });
    if (!photo) {
      throw new NotFoundException(`Foto con ID ${id} no encontrada`);
    }
    Object.assign(photo, dto);
    return await this.photoRepository.save(photo);
  }

  async deletePhoto(id: number): Promise<void> {
    const photo = await this.photoRepository.findOneBy({ id });
    if (!photo) {
      throw new NotFoundException(`Foto con ID ${id} no encontrada`);
    }

    if (photo.publicId) {
      try {
        await this.storageService.deleteFile(photo.publicId);
      } catch (error) {
        this.logger.error(`Failed to delete photo ${photo.publicId} from storage: ${error.message}`, error.stack);
        // Decidir si continuar y eliminar de la DB o lanzar error.
        // Por ahora, lanzaremos error para no dejar registros huérfanos si el borrado en storage falla.
        throw new InternalServerErrorException('Failed to delete photo from storage provider.');
      }
    } else {
      this.logger.warn(`Photo with ID ${id} has no publicId. Skipping deletion from storage service.`);
    }

    const result = await this.photoRepository.delete(id);
    if (result.affected === 0) {
      // Esto no debería ocurrir si findOneBy tuvo éxito, pero es una doble verificación.
      throw new NotFoundException(`Foto con ID ${id} no encontrada para eliminar de la DB.`);
    }
  }
}
