// src/core/storage/cloudinary/cloudinary.service.ts
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, DeleteApiResponse } from 'cloudinary';
import { IStorageService, UploadResult, DeleteResult } from '../storage.interface';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService implements IStorageService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      this.logger.error('Cloudinary environment variables are not fully set. Service may not work correctly.');
      // Podrías lanzar un error aquí si la configuración es esencial para el arranque
      // throw new Error('Cloudinary configuration is missing.');
    } else {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.logger.log('Cloudinary Service Initialized and Configured');
    }
  }

  async uploadFile(
    fileBuffer: Buffer,
    fileName: string, // Opcionalmente usado para 'resource_type' o tags
    mimeType: string,
  ): Promise<UploadResult> {
    this.logger.log(`Attempting to upload file: ${fileName}, mimeType: ${mimeType}`);
    try {
      return new Promise<UploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            // Aquí puedes añadir opciones como 'folder' o 'public_id' si lo deseas
            // Ejemplo: folder: 'property_images',
            resource_type: 'auto', // Detecta automáticamente el tipo de recurso
          },
          (error, result: UploadApiResponse) => {
            if (error) {
              this.logger.error(`Cloudinary upload error for ${fileName}: ${JSON.stringify(error)}`);
              return reject(new InternalServerErrorException('Error uploading file to Cloudinary', error.message));
            }
            if (!result) {
                this.logger.error(`Cloudinary upload for ${fileName} resulted in undefined or null response.`);
                return reject(new InternalServerErrorException('Cloudinary returned undefined response after upload.'));
            }
            this.logger.log(`File ${fileName} uploaded successfully. Public ID: ${result.public_id}, URL: ${result.secure_url}`);
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              providerResponse: result,
            });
          },
        );
        Readable.from(fileBuffer).pipe(uploadStream);
      });
    } catch (error) {
      this.logger.error(`Failed to upload ${fileName} to Cloudinary: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to upload file', error.message);
    }
  }

  async deleteFile(publicId: string): Promise<DeleteResult> {
    this.logger.log(`Attempting to delete file with publicId: ${publicId}`);
    try {
      // El tipo de respuesta de uploader.destroy es más simple, a menudo solo { result: 'ok' | 'not found' | ... }
      // Usar un tipo más genérico o uno local si DeleteApiResponse no encaja.
      const result: { result: string, [key: string]: any } = await cloudinary.uploader.destroy(publicId);

      if (result.result === 'ok' || result.result === 'not found') {
        this.logger.log(`File ${publicId} deletion result: ${result.result}`);
        return {
          success: true,
          message: `File ${publicId} deleted successfully or was not found.`,
          providerResponse: result,
        };
      } else {
        // Si result.result no es 'ok' o 'not found', es un error o un estado inesperado.
        const errorMessage = result.error?.message || JSON.stringify(result);
        this.logger.error(`Cloudinary deletion error for ${publicId}: ${errorMessage}`);
        return {
          success: false,
          message: `Failed to delete file ${publicId}. Result: ${result.result || errorMessage}`,
          providerResponse: result,
        };
      }
    } catch (error) {
      this.logger.error(`Failed to delete ${publicId} from Cloudinary: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to delete file from Cloudinary', error.message);
    }
  }
}
