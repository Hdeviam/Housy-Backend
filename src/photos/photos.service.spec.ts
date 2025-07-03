// src/photos/photos.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotosService } from './photos.service';
import { Photo } from './entity/photo.entity';
import { UploadPhotoDto, SectionType } from './dto/upload-photo.dto';
import { IStorageService, STORAGE_SERVICE, UploadResult, DeleteResult } from 'src/core/storage/storage.interface';
import { NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';

import { IStorageService, STORAGE_SERVICE, UploadResult, DeleteResult } from '../core/storage/storage.interface'; // Ruta corregida
import { NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';

// Mockear Logger de forma que cada instancia creada por `new Logger()` sea un mock individual,
// y podamos acceder a la última instancia creada para verificar las llamadas.
const mockLogFunctions = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  verbose: jest.fn(),
  setContext: jest.fn(),
};

jest.mock('@nestjs/common', () => {
  const originalModule = jest.requireActual('@nestjs/common');
  return {
    ...originalModule,
    Logger: jest.fn().mockImplementation(() => mockLogFunctions),
  };
});

describe('PhotosService', () => {
  let service: PhotosService;
  let photoRepository: jest.Mocked<Repository<Photo>>;
  let storageService: jest.Mocked<IStorageService>;

  beforeEach(async () => {
    // Resetear las funciones mock del logger antes de cada prueba
    Object.values(mockLogFunctions).forEach(mockFn => mockFn.mockReset());

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        {
          provide: getRepositoryToken(Photo),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: STORAGE_SERVICE,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
    photoRepository = module.get(getRepositoryToken(Photo));
    storageService = module.get(STORAGE_SERVICE);

    // Reset mocks for repository and storage service methods if not using fresh mocks per test
    (photoRepository.create as jest.Mock).mockReset();
    (photoRepository.save as jest.Mock).mockReset();
    (photoRepository.findOneBy as jest.Mock).mockReset();
    (photoRepository.find as jest.Mock).mockReset();
    (photoRepository.delete as jest.Mock).mockReset();
    (storageService.uploadFile as jest.Mock).mockReset();
    (storageService.deleteFile as jest.Mock).mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadPhoto', () => {
    const propertyId = 'prop-uuid';
    const dto: UploadPhotoDto = { section: SectionType.kitchen };
    const fileBuffer = Buffer.from('testfile');
    const originalName = 'test.jpg';
    const mimeType = 'image/jpeg';
    const uploadResult: UploadResult = {
      url: 'http://cloudinary.com/test.jpg',
      publicId: 'cloudinary-public-id',
      providerResponse: {},
    };
    // La entidad creada ANTES de ser guardada (sin ID de DB, por ejemplo)
    const photoEntityBeforeSave = {
        propertyId,
        section: dto.section,
        url: uploadResult.url,
        publicId: uploadResult.publicId
        // `id` no estaría aquí si `create` no lo simula
    };
    // La entidad DESPUÉS de ser guardada (con ID de DB)
    const savedPhotoEntity = { id: 1, ...photoEntityBeforeSave };


    it('should upload file, create and save photo entity', async () => {
      storageService.uploadFile.mockResolvedValue(uploadResult);
      photoRepository.create.mockReturnValue(photoEntityBeforeSave as any); // create devuelve la entidad no guardada
      photoRepository.save.mockResolvedValue(savedPhotoEntity as any); // save devuelve la entidad guardada

      const result = await service.uploadPhoto(propertyId, dto, fileBuffer, originalName, mimeType);

      expect(storageService.uploadFile).toHaveBeenCalledWith(fileBuffer, expect.stringContaining(originalName), mimeType);
      expect(photoRepository.create).toHaveBeenCalledWith({
        propertyId,
        section: dto.section,
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      });
      expect(photoRepository.save).toHaveBeenCalledWith(photoEntityBeforeSave); // Se guarda la entidad creada
      expect(result).toEqual(savedPhotoEntity);
    });

    it('should throw InternalServerErrorException if storageService.uploadFile fails', async () => {
      storageService.uploadFile.mockRejectedValue(new Error('Upload failed'));

      await expect(
        service.uploadPhoto(propertyId, dto, fileBuffer, originalName, mimeType),
      ).rejects.toThrow(InternalServerErrorException);
      expect(photoRepository.create).not.toHaveBeenCalled();
      expect(photoRepository.save).not.toHaveBeenCalled();
    });

    it('should attempt to delete uploaded file if photoRepository.save fails', async () => {
      storageService.uploadFile.mockResolvedValue(uploadResult);
      photoRepository.save.mockRejectedValue(new Error('DB save failed'));
      storageService.deleteFile.mockResolvedValue({ success: true } as DeleteResult);

      await expect(
        service.uploadPhoto(propertyId, dto, fileBuffer, originalName, mimeType),
      ).rejects.toThrow(InternalServerErrorException);

      expect(storageService.uploadFile).toHaveBeenCalledTimes(1);
      expect(photoRepository.save).toHaveBeenCalledTimes(1);
      expect(storageService.deleteFile).toHaveBeenCalledWith(uploadResult.publicId);
    });

     it('should log error if deleting uploaded file fails during rollback', async () => {
      storageService.uploadFile.mockResolvedValue(uploadResult);
      photoRepository.save.mockRejectedValue(new Error('DB save failed'));
      storageService.deleteFile.mockRejectedValue(new Error('Storage delete failed during rollback'));

      await expect(
        service.uploadPhoto(propertyId, dto, fileBuffer, originalName, mimeType),
      ).rejects.toThrow(InternalServerErrorException);

      expect(storageService.deleteFile).toHaveBeenCalledWith(uploadResult.publicId);
      expect(mockLogFunctions.error).toHaveBeenCalledWith( // Usar la referencia directa a la función mock
        `Failed to delete uploaded file ${uploadResult.publicId} during rollback: Storage delete failed during rollback`,
        expect.any(String)
      );
    });
  });

  describe('deletePhoto', () => {
    const photoId = 1;
    const photoEntity: Photo = {
      id: photoId,
      url: 'http://cloudinary.com/test.jpg',
      publicId: 'cloudinary-public-id',
      section: SectionType.bedroom,
      propertyId: 'prop-uuid',
      property: null as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const deleteStorageResult: DeleteResult = { success: true, providerResponse: {} };

    it('should delete photo from storage and then from database', async () => {
      photoRepository.findOneBy.mockResolvedValue(photoEntity);
      storageService.deleteFile.mockResolvedValue(deleteStorageResult);
      photoRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.deletePhoto(photoId);

      expect(photoRepository.findOneBy).toHaveBeenCalledWith({ id: photoId });
      expect(storageService.deleteFile).toHaveBeenCalledWith(photoEntity.publicId);
      expect(photoRepository.delete).toHaveBeenCalledWith(photoId);
    });

    it('should throw NotFoundException if photo to delete is not found', async () => {
      photoRepository.findOneBy.mockResolvedValue(null);

      await expect(service.deletePhoto(photoId)).rejects.toThrow(NotFoundException);
      expect(storageService.deleteFile).not.toHaveBeenCalled();
      expect(photoRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if storageService.deleteFile fails', async () => {
        photoRepository.findOneBy.mockResolvedValue(photoEntity);
        storageService.deleteFile.mockRejectedValue(new Error('Storage delete failed'));

        await expect(service.deletePhoto(photoId)).rejects.toThrow(InternalServerErrorException);
        expect(photoRepository.delete).not.toHaveBeenCalled();
    });

    it('should skip storage deletion and proceed if photo has no publicId', async () => {
      const photoWithoutPublicId = { ...photoEntity, publicId: null };
      photoRepository.findOneBy.mockResolvedValue(photoWithoutPublicId);
      photoRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.deletePhoto(photoId);

      expect(mockLogFunctions.warn).toHaveBeenCalledWith(`Photo with ID ${photoId} has no publicId. Skipping deletion from storage service.`); // Usar la referencia directa
      expect(storageService.deleteFile).not.toHaveBeenCalled();
      expect(photoRepository.delete).toHaveBeenCalledWith(photoId);
    });

    it('should throw NotFoundException if photo is not found by delete operation (edge case)', async () => {
        photoRepository.findOneBy.mockResolvedValue(photoEntity);
        storageService.deleteFile.mockResolvedValue(deleteStorageResult);
        photoRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

        await expect(service.deletePhoto(photoId)).rejects.toThrow(new NotFoundException(`Foto con ID ${photoId} no encontrada para eliminar de la DB.`));
    });
  });

  describe('getPhotosByPropertyId', () => {
    it('should return an array of photos for a given propertyId', async () => {
      const propertyId = 'prop-uuid';
      const photos: Photo[] = [
        { id: 1, url: 'url1', publicId: 'pid1', section: SectionType.kitchen, propertyId, property: null as any, createdAt: new Date(), updatedAt: new Date() },
        { id: 2, url: 'url2', publicId: 'pid2', section: SectionType.bathroom, propertyId, property: null as any, createdAt: new Date(), updatedAt: new Date() },
      ];
      photoRepository.find.mockResolvedValue(photos);

      const result = await service.getPhotosByPropertyId(propertyId);
      expect(photoRepository.find).toHaveBeenCalledWith({ where: { propertyId } });
      expect(result).toEqual(photos);
      expect(result.length).toBe(2);
    });
  });

  describe('updatePhoto', () => {
    it('should find a photo, update its section, and save it', async () => {
        const photoId = 1;
        const currentPhoto = { id: photoId, section: SectionType.kitchen, url: 'test.jpg', publicId: 'pid' } as Photo;
        const updateDto: UploadPhotoDto = { section: SectionType.bathroom };
        // El objeto 'currentPhoto' será mutado por Object.assign, y luego guardado.
        // El mock de 'save' debe devolver cómo se vería después de la asignación y el guardado.
        const expectedSavedPhoto = { ...currentPhoto, section: SectionType.bathroom };


        photoRepository.findOneBy.mockResolvedValue(currentPhoto);
        // El método save recibe el objeto photo que fue modificado
        photoRepository.save.mockImplementation(async (photoToSave) => photoToSave as Photo);


        const result = await service.updatePhoto(photoId, updateDto);

        expect(photoRepository.findOneBy).toHaveBeenCalledWith({ id: photoId });
        expect(photoRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            id: photoId,
            section: updateDto.section // Verificamos que la sección se haya actualizado
        }));
        expect(result.section).toEqual(updateDto.section);
    });

    it('should throw NotFoundException if photo to update is not found', async () => {
        const photoId = 1;
        const updateDto: UploadPhotoDto = { section: SectionType.bathroom };
        photoRepository.findOneBy.mockResolvedValue(null);

        await expect(service.updatePhoto(photoId, updateDto)).rejects.toThrow(NotFoundException);
        expect(photoRepository.save).not.toHaveBeenCalled();
    });
  });
});
