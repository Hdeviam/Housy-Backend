/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { Public } from 'src/guards/public.decorator';
import { AuthService } from '../services/auth.service'; // 👈 Asegúrate de usar la ruta correcta
import { RegisterDto } from 'src/dto/register.dto';
import { LoginDto } from 'src/dto/login.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registra un nuevo usuario.
   * @param registerDto - Datos de registro del usuario
   * @returns Nuevo usuario creado
   */
  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<any> {
    return this.authService.register(registerDto);
  }

  /**
   * Inicia sesión y genera un token JWT.
   * @param loginDto - Datos de inicio de sesión
   * @returns Token de acceso
   */
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.authService.validateUser(loginDto);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return { accessToken: user.accessToken };
  }

  /**
   * Devuelve el perfil del usuario autenticado.
   * @param req - Objeto de solicitud HTTP
   * @returns Información del usuario autenticado
   */
  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() req): any {
    return req.user;
  }
}
