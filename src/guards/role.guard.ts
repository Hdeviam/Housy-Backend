import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: {
    role: string;
    sub: number;
    email: string;
  };
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No se requieren roles → acceso permitido
    }

    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('No autorizado: usuario no autenticado o sin rol definido');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`El rol "${user.role}" no tiene acceso a este recurso`);
    }

    return true;
  }
}
