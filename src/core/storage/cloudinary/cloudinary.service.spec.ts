// src/core/storage/cloudinary/cloudinary.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import { UploadResult, DeleteResult } from '../storage.interface'; // IStorageService no es necesario aquí
import { v2 as cloudinary, UploadApiResponse, DeleteApiResponse } from 'cloudinary';
// import { Readable } from 'stream'; // No necesitamos Readable directamente en los tests
import { InternalServerErrorException, Logger } from '@nestjs/common';

// Mockear Logger de forma similar a photos.service.spec.ts
const mockCloudinaryLoggerFunctions = { // Renombrado para evitar colisión si se ejecutan en el mismo contexto global de Jest
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
    Logger: jest.fn().mockImplementation(() => mockCloudinaryLoggerFunctions),
  };
});

// Mockear el SDK de Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

describe('CloudinaryService', () => {
  let service: CloudinaryService;
  let mockConfigService: jest.Mocked<ConfigService>; // Usar jest.Mocked para tipado fuerte

  beforeEach(async () => {
    // Definir el mock de ConfigService con tipado
    const configServiceMock = {
      get: jest.fn((key: string) => {
        if (key === 'CLOUDINARY_CLOUD_NAME') return 'test-cloud';
        if (key === 'CLOUDINARY_API_KEY') return 'test-key';
        if (key === 'CLOUDINARY_API_SECRET') return 'test-secret';
        return null;
      }),
    } as unknown as jest.Mocked<ConfigService>; // unknown as jest.Mocked para forzar el tipo

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
    mockConfigService = module.get(ConfigService); // Obtener la instancia mockeada

    // Limpiar mocks de cloudinary y logger
    (cloudinary.config as jest.Mock).mockReset();
    (cloudinary.uploader.upload_stream as jest.Mock).mockReset();
    (cloudinary.uploader.destroy as jest.Mock).mockReset();
    Object.values(mockCloudinaryLoggerFunctions).forEach(mockFn => mockFn.mockReset()); // Usar el mock renombrado
    mockConfigService.get.mockReset();

    // Re-establecer la implementación por defecto del mock de configService para cada prueba,
    // ya que algunas pruebas podrían modificarla con mockImplementationOnce.
     mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'CLOUDINARY_CLOUD_NAME') return 'test-cloud';
      if (key === 'CLOUDINARY_API_KEY') return 'test-key';
      if (key === 'CLOUDINARY_API_SECRET') return 'test-secret';
      return null;
    });

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Constructor', () => {
    it('should configure cloudinary with credentials from ConfigService', () => {
      // Re-instanciar el servicio para probar el constructor específicamente
      // Esto es porque el constructor ya se llamó en el beforeEach principal.
      // Para evitar esto, podríamos no instanciar 'service' globalmente en beforeEach
      // y hacerlo en cada 'describe' o 'it' que lo necesite.
      // O bien, verificar los efectos del constructor que ya se ejecutó.

      // Llamar al constructor de nuevo creando una nueva instancia (o recompilando el módulo)
      // para asegurar que la lógica del constructor se prueba en aislamiento si es necesario.
      // Sin embargo, para este caso, como el beforeEach ya lo hizo, podemos verificar los mocks.

      // Forzar la ejecución del constructor aquí de nuevo para un test limpio del constructor
      const tempService = new CloudinaryService(mockConfigService);

      expect(mockConfigService.get).toHaveBeenCalledWith('CLOUDINARY_CLOUD_NAME');
      expect(mockConfigService.get).toHaveBeenCalledWith('CLOUDINARY_API_KEY');
      expect(mockConfigService.get).toHaveBeenCalledWith('CLOUDINARY_API_SECRET');
      expect(cloudinary.config).toHaveBeenCalledWith({
        cloud_name: 'test-cloud',
        api_key: 'test-key',
        api_secret: 'test-secret',
        secure: true,
      });
      expect(mockCloudinaryLoggerFunctions.log).toHaveBeenCalledWith('Cloudinary Service Initialized and Configured'); // Usar el mock renombrado
    });

    it('should log an error if Cloudinary env vars are not set', async () => {
        // Modificar el mock para que una variable no esté definida
        mockConfigService.get.mockImplementationOnce((key: string) => {
            if (key === 'CLOUDINARY_CLOUD_NAME') return undefined; // Simula variable faltante
            if (key === 'CLOUDINARY_API_KEY') return 'test-key';
            if (key === 'CLOUDINARY_API_SECRET') return 'test-secret';
            return null;
        });

        // Crear una nueva instancia para probar el constructor con esta configuración de mock
        const tempService = new CloudinaryService(mockConfigService);

        expect(mockCloudinaryLoggerFunctions.error).toHaveBeenCalledWith('Cloudinary environment variables are not fully set. Service may not work correctly.'); // Usar el mock renombrado
        // Asegurarse de que cloudinary.config no fue llamado si las variables faltan
        expect(cloudinary.config).not.toHaveBeenCalled();
    });
  });

  describe('uploadFile', () => {
    const fileBuffer = Buffer.from('test');
    const fileName = 'test.jpg';
    const mimeType = 'image/jpeg';

    it('should upload a file and return UploadResult', async () => {
      const mockUploadApiResponse = {
        secure_url: 'http://secure.url/test.jpg',
        public_id: 'publicid123',
      } as UploadApiResponse;

      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementationOnce((options, callback) => {
        callback(null, mockUploadApiResponse);
        // Simular el comportamiento de pipe() devolviendo algo que se parezca a un stream para evitar errores
        return { pipe: jest.fn().mockReturnThis(), on: jest.fn().mockReturnThis() };
      });

      const result = await service.uploadFile(fileBuffer, fileName, mimeType);

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        { resource_type: 'auto' },
        expect.any(Function),
      );
      expect(result.url).toBe(mockUploadApiResponse.secure_url);
      expect(result.publicId).toBe(mockUploadApiResponse.public_id);
      expect(mockCloudinaryLoggerFunctions.log).toHaveBeenCalledWith(`File ${fileName} uploaded successfully. Public ID: ${mockUploadApiResponse.public_id}, URL: ${mockUploadApiResponse.secure_url}`); // Usar el mock renombrado
    });

    it('should throw InternalServerErrorException if upload_stream callback returns an error', async () => {
      const error = { message: 'Cloudinary upload error detail' }; // Simular error de Cloudinary
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementationOnce((options, callback) => {
        callback(error, null);
        return { pipe: jest.fn().mockReturnThis(), on: jest.fn().mockReturnThis() };
      });

      await expect(service.uploadFile(fileBuffer, fileName, mimeType)).rejects.toThrow(
        new InternalServerErrorException('Error uploading file to Cloudinary', error.message),
      );
       expect(mockCloudinaryLoggerFunctions.error).toHaveBeenCalledWith(`Cloudinary upload error for ${fileName}: ${JSON.stringify(error)}`); // Usar el mock renombrado
    });

    it('should throw InternalServerErrorException if upload_stream callback returns no result and no error', async () => {
      (cloudinary.uploader.upload_stream as jest.Mock).mockImplementationOnce((options, callback) => {
        callback(null, undefined);
        return { pipe: jest.fn().mockReturnThis(), on: jest.fn().mockReturnThis() };
      });

      await expect(service.uploadFile(fileBuffer, fileName, mimeType)).rejects.toThrow(
        new InternalServerErrorException('Cloudinary returned undefined response after upload.'),
      );
      expect(mockCloudinaryLoggerFunctions.error).toHaveBeenCalledWith(`Cloudinary upload for ${fileName} resulted in undefined or null response.`); // Usar el mock renombrado
    });
  });

  describe('deleteFile', () => {
    const publicId = 'publicid123';
    // El tipo que nuestro servicio espera ahora es { result: string, [key: string]: any }
    // por lo que el mock debe coincidir con esa expectativa.
    // Ya no usamos DeleteApiResponse directamente en los mocks de respuesta.

    it('should delete a file and return DeleteResult for "ok"', async () => {
      const mockOkResponse = { result: 'ok' }; // Coincide con { result: string, ... }
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue(mockOkResponse);

      const result = await service.deleteFile(publicId);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(publicId);
      expect(result.success).toBe(true);
      expect(result.message).toContain('deleted successfully or was not found');
    });

    it('should return DeleteResult with success true for "not found"', async () => {
      const mockNotFoundResponse = { result: 'not found' };
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue(mockNotFoundResponse);

      const result = await service.deleteFile(publicId);
      expect(result.success).toBe(true);
      expect(result.message).toContain('deleted successfully or was not found');
    });

    it('should return success false if deletion result is not "ok" or "not found"', async () => {
      const mockFailedResponse = { result: 'failed_somehow', error: { message: 'Some API error' } };
      (cloudinary.uploader.destroy as jest.Mock).mockResolvedValue(mockFailedResponse);

      const result = await service.deleteFile(publicId);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Failed to delete file');
      // El servicio ahora intenta extraer result.error.message si existe
      expect(mockCloudinaryLoggerFunctions.error).toHaveBeenCalledWith(`Cloudinary deletion error for ${publicId}: ${mockFailedResponse.error.message}`); // Usar el mock renombrado
    });

    it('should throw InternalServerErrorException if cloudinary.uploader.destroy rejects', async () => {
      const error = new Error('Cloudinary destroy error');
      (cloudinary.uploader.destroy as jest.Mock).mockRejectedValue(error);

      await expect(service.deleteFile(publicId)).rejects.toThrow(
        new InternalServerErrorException('Failed to delete file from Cloudinary', error.message),
      );
      expect(mockCloudinaryLoggerFunctions.error).toHaveBeenCalledWith(`Failed to delete ${publicId} from Cloudinary: ${error.message}`, expect.any(String)); // Usar el mock renombrado
    });
  });
});
