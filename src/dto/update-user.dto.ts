import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './create-user.dto';

export class UpdateUserDto {
  @ApiProperty({ example: 'user@example.com', required: false })
  email?: string;

  @ApiProperty({ example: 'Jane Smith', required: false })
  name?: string;

  @ApiProperty({
    example: 'agent',
    enum: ['admin', 'agent', 'client'],
    required: false,
  })
  role?: UserRole;
}
