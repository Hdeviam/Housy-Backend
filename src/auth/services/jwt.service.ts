/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtServiceCustom {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: any): Promise<string> {
    return this.jwtService.signAsync({ user });
  }
}
