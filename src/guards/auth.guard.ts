import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

interface User {
  id: string;
  // Add other user properties here as needed
}

interface RequestWithUser extends Request {
  user: User;
}
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split('Bearer ')[1] ?? '';

    if (!token) {
      return false;
    }

    try {
      const decoded = this.jwtService.verify<User>(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = decoded;
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
