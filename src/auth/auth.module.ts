import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from 'src/repository/auth.repository';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret', // usa variable de entorno o valor por defecto
      signOptions: { expiresIn: '1h' }, // tiempo de expiración del token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [AuthService, JwtModule], // 👈 exporta JwtModule para que otros módulos puedan inyectar JwtService
})
export class AuthModule {}
