import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from 'src/entities/visit.entity';
import { VisitsController } from './visits.controller';
import { VisitsService } from './visits.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Visit]), AuthModule],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}
