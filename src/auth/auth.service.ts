/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario.
   * @param registerDto - Datos del usuario a registrar
   * @returns Objeto de usuario creado (sin la contraseña)
   */
  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ email: registerDto.email });

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está en uso.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    // ✅ Excluir el password al devolver
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword as User;
  }

  /**
   * Valida las credenciales de un usuario.
   * @param loginDto - Datos de inicio de sesión
   * @returns Usuario validado o null si no coincide
   */
  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'name', 'role'],
    });

    if (!user) return null;

    const passwordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!passwordValid) return null;

    // ✅ Excluir el password al devolver
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Genera un token JWT basado en la información del usuario.
   * @param user - Objeto de usuario autenticado
   * @returns Token JWT firmado
   */
  generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
