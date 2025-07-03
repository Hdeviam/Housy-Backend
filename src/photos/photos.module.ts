import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Photo } from 'src/photos/entity/photo.entity';
import { PhotoController } from './photo.controller';
import { PhotosService } from './photos.service';
import { CloudinaryStorageModule } from 'src/core/storage/cloudinary/cloudinary.module'; // Importar el módulo de Cloudinary

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    AuthModule, // ✅ Necesario para acceder a JwtService
    CloudinaryStorageModule, // Añadir el módulo para que STORAGE_SERVICE esté disponible
  ],
  controllers: [PhotoController],
  providers: [PhotosService],
})
export class PhotosModule {}
