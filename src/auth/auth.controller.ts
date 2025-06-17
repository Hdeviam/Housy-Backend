import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { User } from 'src/users/entity/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registra un nuevo usuario.
   * @param registerDto - Datos del usuario a registrar
   * @returns Respuesta con mensaje y datos del usuario
   */
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado correctamente', type: Object })
  @UsePipes(new ValidationPipe()) // 👈 Aplica el pipe de validación
  async register(@Body() registerDto: RegisterDto): Promise<{ message: string; user: User }> {
    const user = await this.authService.register(registerDto);
    return {
      message: 'Usuario registrado exitosamente.',
      user,
    };
  }

  /**
   * Inicia sesión y valida usuario.
   * Retorna token de acceso si las credenciales son válidas.
   * @param loginDto - Datos de inicio de sesión
   * @returns Token JWT y datos del usuario
   */
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login exitoso, token generado', type: Object })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @UsePipes(new ValidationPipe()) // 👈 Aplica el pipe de validación
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string; user: any }> {
    const user = await this.authService.validateUser(loginDto);
    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const accessToken = this.authService.generateToken(user);
    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
