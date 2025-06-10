/* eslint-disable @typescript-eslint/await-thenable */
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '../entities/user.entity';
import { UserRole } from '../dto/create-user.dto'; // 👈 Importa el enum UserRole
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * Registra un nuevo usuario.
   */
  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.authRepository.findUserByEmail(registerDto.email);

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser: Partial<User> = {
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.client, // 👈 Usa el enum UserRole
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.authRepository.createUser(newUser);
  }

  /**
   * Valida las credenciales de un usuario.
   */
  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.authRepository.findUserByEmail(loginDto.email);

    if (!user) {
      return null;
    }

    const passwordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordValid) {
      return null;
    }

    return user;
  }
}
