import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registra un nuevo usuario.
   */
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente' })
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return await this.authService.register(registerDto);
  }

  /**
   * Inicia sesión y valida usuario.
   * Retorna token de acceso si las credenciales son válidas.
   */
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login exitoso, token generado' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string; user: any }> {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const accessToken = this.authService.generateToken(user); // 👈 Genera el token
    return { access_token: accessToken, user }; // 👈 Devuelve el token y el usuario
  }
}
