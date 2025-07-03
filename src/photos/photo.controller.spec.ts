// src/photos/photo.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PhotoController } from './photo.controller';
import { PhotosService } from './photos.service';
import { UploadPhotoDto, SectionType } from './dto/upload-photo.dto';
import { Photo } from './entity/photo.entity';
import { AuthGuard } from '../guards/auth.guard'; // Ruta corregida
import { RoleGuard } from '../guards/role.guard'; // Ruta corregida
import { BadRequestException, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
// Asegúrate de que @types/multer está en devDependencies para Express.Multer.File
import 'multer'; // Importar para asegurar que Express.Multer.File esté disponible globalmente

describe('PhotoController', () => {
  let controller: PhotoController;
  let photosService: jest.Mocked<PhotosService>;

  const mockPhotosService = {
    uploadPhoto: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotoController],
      providers: [
        {
          provide: PhotosService,
          useValue: mockPhotosService,
        },
      ],
    })
    .overrideGuard(AuthGuard) // Mockeamos los guards para aislarlos de la prueba unitaria del controlador
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RoleGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<PhotoController>(PhotoController);
    photosService = module.get(PhotosService) as jest.Mocked<PhotosService>;

    photosService.uploadPhoto.mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadPhoto', () => {
    const propertyId = 'test-property-id';
    const dto: UploadPhotoDto = { section: SectionType.exterior };
    const mockFile = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('fakeImageData'),
      size: 1024 * 100, // 100KB, dentro de los límites del pipe
      stream: null as any, // Añadir propiedades faltantes de Express.Multer.File
      destination: '',
      filename: '',
      path: '',
    } as Express.Multer.File;

    const expectedPhotoResult: Photo = {
      id: 1,
      url: 'http://example.com/photo.jpg',
      publicId: 'publicId123',
      section: dto.section,
      propertyId: propertyId,
      createdAt: new Date(),
      updatedAt: new Date(),
      property: null as any,
    };

    it('should call photosService.uploadPhoto with correct parameters and return a photo', async () => {
      photosService.uploadPhoto.mockResolvedValue(expectedPhotoResult);

      // El ParseFilePipe se ejecuta antes que el método del controlador.
      // Para probar el controlador en aislamiento, asumimos que el pipe ha pasado.
      const result = await controller.uploadPhoto(propertyId, mockFile, dto);

      expect(photosService.uploadPhoto).toHaveBeenCalledWith(
        propertyId,
        dto,
        mockFile.buffer,
        mockFile.originalname,
        mockFile.mimetype,
      );
      expect(result).toEqual(expectedPhotoResult);
    });

    it('should throw BadRequestException if file buffer is missing (controller internal check)', async () => {
      // Usamos 'as any' o un casteo más específico si es necesario para simular un objeto File malformado
      const fileWithoutBuffer = { ...mockFile, buffer: undefined } as any;

      // Asumimos que el ParseFilePipe podría no capturar esto si el objeto 'file' existe pero 'buffer' no.
      // Esta es una prueba para la guarda explícita en el controlador.
      await expect(controller.uploadPhoto(propertyId, fileWithoutBuffer, dto))
        .rejects.toThrow(new BadRequestException('File buffer is missing.'));

      expect(photosService.uploadPhoto).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if file is not present (controller internal check)', async () => {
      // Esta prueba es para la guarda explícita `if (!file ...)` en el controlador.
      // El ParseFilePipe usualmente lanzaría su propio error si `file` es undefined,
      // pero si el pipe se configurara para ser opcional, esta guarda sería relevante.
      await expect(controller.uploadPhoto(propertyId, undefined as any, dto))
        .rejects.toThrow(new BadRequestException('File buffer is missing.'));

      expect(photosService.uploadPhoto).not.toHaveBeenCalled();
    });

    // Probar el comportamiento del ParseFilePipe en sí mismo es más una prueba de integración
    // o una prueba de la configuración del pipe. Aquí nos centramos en la lógica del controlador.
    // Para probar que el pipe se aplica, podríamos necesitar un enfoque de prueba E2E o
    // una forma de invocar los pipes programáticamente, lo cual está fuera del alcance de
    // una prueba unitaria típica del controlador.
    // La presencia del decorador @UploadedFile(new ParseFilePipe(...)) es la declaración de su uso.
  });
});
