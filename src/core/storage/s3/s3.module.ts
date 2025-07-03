// src/core/storage/s3/s3.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3StorageService } from './s3.service';
import { STORAGE_SERVICE } from '../storage.interface';

@Module({
  imports: [
    ConfigModule, // Necesario para que S3StorageService pueda acceder a ConfigService,
                  // incluso si la implementación actual es un placeholder.
  ],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: S3StorageService, // Si PhotosModule importara S3StorageModule en lugar de
                                  // CloudinaryStorageModule, esta sería la implementación inyectada.
    },
    // Opcionalmente, proveer S3StorageService directamente:
    // S3StorageService,
  ],
  exports: [
    STORAGE_SERVICE, // Para permitir que otros módulos inyecten IStorageService
                     // si este módulo es el que se elige.
    // S3StorageService, // Si también se quiere exportar la clase concreta.
  ],
})
export class S3StorageModule {}
