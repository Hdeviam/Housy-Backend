/* eslint-disable @typescript-eslint/no-unused-vars */
// src/guards/auth.guard.ts

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener el request del contexto
    const request: RequestWithUser = context.switchToHttp().getRequest();

    // Extraer token desde header Authorization
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    let payload: JwtPayload;
    try {
      // Verificar el token y obtener el payload decodificado
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET || 'default-secret',
      });

      // Guardar payload en request para uso posterior
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return true;
  }

  private extractTokenFromHeader(request: RequestWithUser): string | undefined {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return undefined;
  }
}
