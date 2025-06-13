/* eslint-disable @typescript-eslint/require-await */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

// 👇 Tipifica el request extendido con datos del usuario
interface RequestWithUser extends Request {
  user: {
    role: string;
    sub: number; // ID del usuario si es necesario
    email: string;
  };
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new Error('Usuario no autenticado o rol no definido');
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new Error(`El rol "${user.role}" no tiene permiso para acceder a este recurso`);
    }

    return true;
  }
}
