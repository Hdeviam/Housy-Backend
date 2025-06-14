import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SectionType {
  kitchen = 'kitchen',
  bathroom = 'bathroom',
  livingRoom = 'livingRoom',
  bedroom = 'bedroom',
  exterior = 'exterior',
}

export class UploadPhotoDto {
  @ApiProperty({
    example: 'kitchen',
    enum: SectionType,
  })
  @IsEnum(SectionType)
  section: SectionType;
}
