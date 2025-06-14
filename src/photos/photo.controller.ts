import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PhotosService } from './photos.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UploadPhotoDto } from '../dto/upload-photo.dto';
import { Photo } from '../entities/photo.entity';

// 👇 Interfaz temporal para evitar problemas con Express.Multer.File
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}

@ApiTags('Photos')
@Controller('photos')
export class PhotoController {
  constructor(private readonly photosService: PhotosService) {}

  @Post(':propertyId/upload')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'agent')
  @ApiOperation({ summary: 'Subir foto a una propiedad' })
  @ApiParam({
    name: 'propertyId',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la propiedad',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        section: {
          type: 'string',
          enum: ['kitchen', 'bathroom', 'livingRoom', 'bedroom', 'exterior'],
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @Param('propertyId') propertyId: string,
    @UploadedFile() file: MulterFile, // 👈 Usamos la interfaz local
    @Body() dto: UploadPhotoDto,
  ): Promise<Photo> {
    const photo = this.photosService.uploadPhoto(propertyId, {
      section: dto.section,
    });

    return photo;
  }
}
