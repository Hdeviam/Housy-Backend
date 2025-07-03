import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PhotosService } from './photos.service';
// Necesitaremos Express para el tipo Multer.File si no está globalmente disponible
// import { Express } from 'express';
import { AuthGuard } from '../guards/auth.guard'; // Ajustada la ruta
import { RoleGuard } from '../guards/role.guard'; // Ajustada la ruta
import { Roles } from '../decorators/roles.decorator'; // Ajustada la ruta
import { UploadPhotoDto } from './dto/upload-photo.dto';
import { Photo } from './entity/photo.entity';

// Usar directamente Express.Multer.File si los tipos están instalados y reconocidos.
// Si hay problemas, asegúrate de que @types/multer esté en devDependencies.
// npm install --save-dev @types/multer

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
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp|gif)' }),
        ],
        exceptionFactory: (error) => {
          throw new BadRequestException(`Validation failed: ${error}`);
        }
      }),
    )
    file: Express.Multer.File, // Usar el tipo de Express
    @Body() dto: UploadPhotoDto,
  ): Promise<Photo> {
    if (!file || !file.buffer) {
      throw new BadRequestException('File buffer is missing.');
    }
    // Pasar el buffer del archivo, nombre original y mimetype al servicio
    return this.photosService.uploadPhoto(
      propertyId,
      dto, // contiene la 'section'
      file.buffer,
      file.originalname,
      file.mimetype,
    );
  }
}
