import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from 'src/visits/entity/visit.entity';
import { VisitsService } from './visits.service';
import { AuthModule } from 'src/auth/auth.module';
import { VisitRepository } from './repository/visit.repository';
import { VisitsController } from './visits.controller';
import { PropertiesModule } from 'src/properties/properties.module'; // 👈 IMPORTAR AQUÍ

@Module({
  imports: [TypeOrmModule.forFeature([Visit, VisitRepository]), AuthModule, PropertiesModule],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}
