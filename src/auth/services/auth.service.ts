/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { JwtServiceCustom } from './jwt.service';
import { User } from '../../entities/user.entity';
import { UserRepository } from '../../repository/user.repository';
import { RegisterDto } from 'src/dto/register.dto';
import { LoginDto } from 'src/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtServiceCustom,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findUserByEmail(registerDto.email);

    if (existingUser) {
      throw new Error('Email already in use');
    }

    const newUser: User = {
      id: Math.floor(Math.random() * 1_000_000_000),
      ...registerDto,
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.userRepository.createUser(newUser);
  }

  async validateUser(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findUserByEmail(loginDto.email);

    if (!user || user.password !== loginDto.password) {
      throw new Error('Invalid credentials');
    }

    const token = await this.jwtService.generateToken(user);
    return { accessToken: token };
  }
}
