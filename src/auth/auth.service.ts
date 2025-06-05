import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  /**
   * Registra un nuevo usuario.
   * @param registerDto - Datos de registro del usuario
   * @returns El usuario creado
   * @throws Error si el correo ya existe
   */
  register(registerDto: RegisterDto): User {
    const existingUser = this.authRepository.findUserByEmail(registerDto.email);

    if (existingUser) {
      throw new Error('Email already in use');
    }

    const newUser: User = {
      id: Math.floor(Math.random() * 1_000_000_000),
      email: registerDto.email,
      name: registerDto.name,
      password: registerDto.password,
      role: 'client', // Campo obligatorio según la entity
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.authRepository.createUser(newUser);
  }

  /**
   * Valida las credenciales de un usuario.
   * @param loginDto - Datos de inicio de sesión
   * @returns El usuario validado o null si no coincide
   */
  validateUser(loginDto: LoginDto): User | null {
    const user = this.authRepository.findUserByEmail(loginDto.email);

    if (!user || user.password !== loginDto.password) {
      return null;
    }

    return user;
  }
}
