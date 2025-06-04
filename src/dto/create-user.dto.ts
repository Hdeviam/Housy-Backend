import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  admin = 'admin',
  agent = 'agent',
  client = 'client',
}

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'client', enum: ['admin', 'agent', 'client'] })
  role: UserRole;
}
