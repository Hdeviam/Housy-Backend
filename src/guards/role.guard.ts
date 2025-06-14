// src/guards/role.guard.ts

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

// Extendemos la interfaz Request para agregar la propiedad opcional 'user' con tipo JwtPayload
interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Injectable()
// Marca esta clase como un proveedor inyectable para usar en NestJS
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  // Inyectamos Reflector para acceder a la metadata de roles

  canActivate(context: ExecutionContext): boolean {
    // Método que decide si se permite o no la ejecución del handler

    // Obtenemos los roles requeridos configurados en el endpoint (handler o clase)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(), // Método controlador actual
      context.getClass(), // Clase controlador actual
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      // Si no hay roles definidos para la ruta, permitimos el acceso
      return true;
    }

    // Obtenemos la petición HTTP y la tipamos con nuestra interfaz para usar 'user'
    const request: RequestWithUser = context.switchToHttp().getRequest();

    // Obtenemos el usuario del request (se espera que el AuthGuard haya agregado esto)
    const user = request.user;

    if (!user || !user.role) {
      // Si no hay usuario autenticado o el usuario no tiene rol, bloqueamos el acceso
      throw new ForbiddenException('No autorizado: usuario no autenticado o sin rol definido');
    }

    // Verificamos que el rol del usuario esté dentro de los roles permitidos para el endpoint
    if (!requiredRoles.includes(user.role)) {
      // Si el rol no está permitido, lanzamos excepción Forbidden (403)
      throw new ForbiddenException(`El rol "${user.role}" no tiene acceso a este recurso`);
    }

    // Si todo está bien, permitimos la ejecución del endpoint
    return true;
  }
}
