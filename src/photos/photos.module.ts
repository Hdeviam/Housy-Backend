import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Photo } from 'src/entities/photo.entity';
import { PhotoController } from './photo.controller';
import { PhotosService } from './photos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Photo]),
    AuthModule, // ✅ Necesario para acceder a JwtService
  ],
  controllers: [PhotoController],
  providers: [PhotosService],
})
export class PhotosModule {}
